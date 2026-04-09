/* Use case for deleting a user */
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';

// Interfaz para el DTO de eliminación de usuario
export interface DeleteUserDto {
    targetUserId: string;
    requesterId: string;
}

// Decorador Injectable para que NestJS pueda inyectar dependencias
@Injectable()
// Clase que implementa la lógica de negocio para eliminar un usuario
export class DeleteUserUseCase {
    // Inyección del repositorio de usuarios a través del constructor
    constructor(
        // Inyección del repositorio de usuarios utilizando el token USER_REPOSITORY
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) { }

    // Método principal que ejecuta la lógica de eliminación de usuario
    async execute(dto: DeleteUserDto): Promise<void> {
        // Validación del solicitante
        const requester = await this.userRepository.findById(dto.requesterId);
        // Si no se encuentra el solicitante, se lanza un error
        if (!requester) {
            throw new Error('Solicitante no encontrado');
        }
        // Si el solicitante no es un administrador, se lanza un error
        if (!requester.isAdmin()) {
            throw new Error('Solo un administrador puede eliminar usuarios');
        }

        // Validación del usuario objetivo
        const target = await this.userRepository.findById(dto.targetUserId);
        // Si no se encuentra el usuario objetivo, se lanza un error
        if (!target) {
            throw new Error('Usuario a eliminar no encontrado');
        }
        // Si el usuario objetivo es un administrador, se lanza un error para evitar que un administrador elimine a otro administrador
        if (target.isAdmin()) {
            throw new Error('No se puede eliminar a otro administrador');
        }

        // Si todas las validaciones pasan, se procede a eliminar el usuario objetivo utilizando el repositorio
        await this.userRepository.delete(dto.targetUserId);
    }
}