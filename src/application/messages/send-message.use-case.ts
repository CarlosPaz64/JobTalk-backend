/* Use case for sending a message */
import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import type { IMessageRepository } from '../../domain/repositories/message.repository';
import { CHAT_REPOSITORY } from '../../domain/repositories/chat.repository';
import type { IChatRepository } from '../../domain/repositories/chat.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Message, MessageType } from '../../domain/entities/message.entity';
import { v4 as uuidv4 } from 'uuid';

// Interfaz para el DTO de envío de mensaje
export interface SendMessageDto {
    chatId: string;
    senderId: string;
    content: string;
    type: MessageType;
    // Es opcional, solo se requiere si el tipo de mensaje es IMAGE, VIDEO o FILE
    fileUrl?: string;
}

// Decorador Injectable para que NestJS pueda inyectar dependencias
@Injectable()
export class SendMessageUseCase {
    constructor(
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: IMessageRepository,
        @Inject(CHAT_REPOSITORY)
        private readonly chatRepository: IChatRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    async execute(dto: SendMessageDto): Promise<Message> {
        const sender = await this.userRepository.findById(dto.senderId);
        if (!sender) {
            throw new Error('Remitente no encontrado');
        }
        if (!sender.canSendMessages()) {
            throw new Error('El usuario no está verificado o está inactivo');
        }

        const chat = await this.chatRepository.findById(dto.chatId);
        if (!chat) {
            throw new Error('Chat no encontrado');
        }
        if (!chat.hasMember(dto.senderId)) {
            throw new Error('El usuario no pertenece a este chat');
        }

        const now = new Date();
        const message = new Message(
            uuidv4(),
            dto.chatId,
            dto.senderId,
            dto.content,
            dto.type,
            dto.fileUrl ?? null,
            [],     // readByIds vacío al inicio
            false,  // isDeleted
            now,
            now,
        );

        return this.messageRepository.save(message);
    }
}