/* Use case for creating a chat */
import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY } from '../../domain/repositories/chat.repository';
import type { IChatRepository } from '../../domain/repositories/chat.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Chat, ChatType } from '../../domain/entities/chat.entity';
import { v4 as uuidv4 } from 'uuid';

// Interfaz para el DTO de creación de chat
export interface CreateChatDto {
    name: string;
    type: ChatType;
    createdById: string;
    memberIds: string[];
}

// Decorador Injectable para que NestJS pueda inyectar dependencias
@Injectable()
// Clase que implementa la lógica de negocio para crear un chat
export class CreateChatUseCase {
    constructor(
        // Decorador Inject para inyectar el repositorio de chats utilizando el token CHAT_REPOSITORY
        @Inject(CHAT_REPOSITORY)
        private readonly chatRepository: IChatRepository,
        // Decorador Inject para inyectar el repositorio de usuarios utilizando el token USER_REPOSITORY
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    // Método principal que ejecuta la lógica de creación de chat
    async execute(dto: CreateChatDto): Promise<Chat> {
        // Constante para validar el creador del chat, asegurando que exista y tenga permisos de administrador
        const creator = await this.userRepository.findById(dto.createdById);
        if (!creator) {
            throw new Error('Creador no encontrado');
        }
        // Si el creador no es un administrador, se lanza un error para evitar que usuarios sin permisos creen chats
        if (!creator.isAdmin()) {
            throw new Error('Solo un administrador puede crear chats');
        }

        // Validación de los miembros del chat, asegurando que todos los IDs de miembros correspondan a usuarios existentes
        for (const memberId of dto.memberIds) {
            const member = await this.userRepository.findById(memberId);
            if (!member) {
                throw new Error(`Miembro no encontrado: ${memberId}`);
            }
        }

        // Creación de la instancia de Chat utilizando los datos del DTO, generando un ID único con uuidv4 y estableciendo las fechas de creación y actualización
        const now = new Date();
        // Uso de Set para eliminar posibles IDs de miembros duplicados, asegurando que el creador del chat siempre esté incluido como miembro
        const memberIds = [...new Set([dto.createdById, ...dto.memberIds])];

        // Creación de la instancia de Chat utilizando los datos del DTO, generando un ID único con uuidv4 y estableciendo las fechas de creación y actualización
        const chat = new Chat(
            uuidv4(),
            dto.name.trim(),
            dto.type,
            dto.createdById,
            memberIds,
            true,
            now,
            now,
        );

        // Guardado del nuevo chat utilizando el repositorio de chats, devolviendo la instancia del chat creado
        return this.chatRepository.save(chat);
    }
}