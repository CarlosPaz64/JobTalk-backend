/* Use case for adding a member to a chat */
import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../../domain/repositories/chat.repository';
import type { IChatRepository } from '../../domain/repositories/chat.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Chat } from '../../domain/entities/chat.entity';

// Interfaz para el DTO de agregar miembro a un chat
export interface AddMemberDto {
    chatId: string;
    userIdToAdd: string;
    // El ID del usuario que realiza la solicitud de agregar un miembro, necesario para validar permisos
    requesterId: string;
}

// Decorador Injectable para que NestJS pueda inyectar dependencias
@Injectable()
export class AddMemberUseCase {
    // Inyección de los repositorios de chats y usuarios a través del constructor, utilizando los tokens definidos para cada repositorio
    constructor(
        // Decorador Inject para inyectar el repositorio de chats utilizando el token CHAT_REPOSITORY
        @Inject(CHAT_REPOSITORY)
        private readonly chatRepository: IChatRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    // Método para ejecutar la lógica de agregar un miembro a un chat, validando permisos y existencia de entidades involucradas
    async execute(dto: AddMemberDto): Promise<Chat> {
        const requester = await this.userRepository.findById(dto.requesterId);
        // Validación del solicitante, asegurando que exista y tenga permisos de administrador para agregar miembros a un chat
        if (!requester?.isAdmin()) {
            throw new Error('Solo un administrador puede agregar miembros');
        }

        // Constante para validar la existencia del chat al que se desea agregar un miembro, asegurando que el chat exista antes de intentar modificarlo
        const chat = await this.chatRepository.findById(dto.chatId);
        // Si no se encuentra el chat, se lanza un error para evitar intentar agregar un miembro a un chat inexistente
        if (!chat) {
            throw new Error('Chat no encontrado');
        }

        // Constante para validar la existencia del usuario que se desea agregar al chat, asegurando que el usuario exista antes de intentar agregarlo como miembro
        const userToAdd = await this.userRepository.findById(dto.userIdToAdd);
        // Validación del usuario a agregar, asegurando que exista antes de intentar agregarlo como miembro al chat, y lanzando un error si no se encuentra el usuario para evitar inconsistencias en los datos del chat. La lógica de agregar el miembro al chat se delega a la entidad Chat, manteniendo la regla de negocio dentro de la entidad y no en el caso de uso. Si todas las validaciones pasan, se actualiza el chat con el nuevo miembro utilizando el repositorio de chats.
        if (!userToAdd) {
            throw new Error('Usuario a agregar no encontrado');
        }

        // La regla de negocio vive en la entidad, no aquí
        chat.addMember(dto.userIdToAdd);

        // Retorna el chat actualizado después de agregar el nuevo miembro, utilizando el método update del repositorio de chats para persistir los cambios en la base de datos. Esto asegura que la lógica de negocio se mantenga dentro de la entidad Chat, mientras que el caso de uso se encarga de orquestar las validaciones y la interacción con los repositorios.
        return this.chatRepository.update(chat);
    }
}