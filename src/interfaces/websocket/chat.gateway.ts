/* Gateway para gestionar las operaciones de WebSocket relacionadas con los chats */
// Importaciones de NestJS donde se utilizan WebSockets, servicios y DTOs
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { UseGuards, Logger, Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SendMessageUseCase } from '../../application/messages/send-message.use-case';
import { MessageType } from '../../domain/entities/message.entity';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';

// Interfaz que extiende la interfaz Socket de Socket.IO para incluir el userId del usuario autenticado
interface AuthenticatedSocket extends Socket {
    userId: string;
}

// Decorador que define esta clase como un gateway de WebSocket para la ruta '/chat' y permite CORS desde cualquier origen
@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/chat',
})
// Implemetación de los interfaces OnGatewayConnection y OnGatewayDisconnect para manejar las conexiones y desconexiones de los clientes
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // Decorador que inyecta el servidor de WebSocket para poder emitir eventos a los clientes conectados
    @WebSocketServer()
    server!: Server;

    private readonly logger = new Logger(ChatGateway.name);

    constructor(
        private readonly sendMessageUseCase: SendMessageUseCase,
        // Inyección del repositorio de usuarios para validar las conexiones entrantes
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    // Método que se ejecuta cuando un cliente se conecta al gateway
    async handleConnection(client: AuthenticatedSocket) {
        const userId = client.handshake.auth?.userId as string;

        if (!userId) {
            client.disconnect();
            return;
        }

        const user = await this.userRepository.findById(userId);
        if (!user || !user.canSendMessages()) {
            client.disconnect();
            return;
        }

        client.userId = userId;
        this.logger.log(`Cliente conectado: ${userId}`);
    }

    handleDisconnect(client: AuthenticatedSocket) {
        this.logger.log(`Cliente desconectado: ${client.userId}`);
    }

    @SubscribeMessage('join_chat')
    handleJoinChat(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() payload: { chatId: string },
    ) {
        client.join(payload.chatId);
        this.logger.log(`Usuario ${client.userId} se unió al chat ${payload.chatId}`);
        return { event: 'joined', chatId: payload.chatId };
    }

    @SubscribeMessage('leave_chat')
    handleLeaveChat(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() payload: { chatId: string },
    ) {
        client.leave(payload.chatId);
        return { event: 'left', chatId: payload.chatId };
    }

    @SubscribeMessage('send_message')
    async handleMessage(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody()
        payload: { chatId: string; content: string; type?: MessageType },
    ) {
        try {
            const message = await this.sendMessageUseCase.execute({
                chatId: payload.chatId,
                senderId: client.userId,
                content: payload.content,
                type: payload.type ?? MessageType.TEXT,
            });

            // Emitimos el mensaje a todos los miembros del chat incluyendo al emisor
            this.server.to(payload.chatId).emit('new_message', message);

            return { event: 'message_sent', messageId: message.id };
        } catch (error) {
            // Si ocurre un error, lo capturamos y lanzamos una excepción de WebSocket con un mensaje adecuado
            const errorMessage = error instanceof Error ? error.message : 'Ha ocurrido un error desconocido';
            throw new WsException(errorMessage);
        }
    }

    @SubscribeMessage('typing')
    handleTyping(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() payload: { chatId: string; isTyping: boolean },
    ) {
        // Notificamos a todos en el chat excepto al que escribe
        client.to(payload.chatId).emit('user_typing', {
            userId: client.userId,
            isTyping: payload.isTyping,
        });
    }
}