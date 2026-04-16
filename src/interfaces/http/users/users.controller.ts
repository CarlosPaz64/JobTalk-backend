/* Controlador para gestionar las operaciones de usuario */
// Importaciones de NestJS para crear un controlador y manejar las solicitudes HTTP
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../../shared/guards/jwt.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { UserRole } from '../../../domain/value-objects/user-role.vo';
import { CreateUserUseCase } from '../../../application/users/create-user.use-case';
import { DeleteUserUseCase } from '../../../application/users/delete-user.use-case';
import { CreateUserRequestDto } from './dtos/create-user.dto';

// Decorador que especifica que esta clase es un controlador y que manejará las rutas bajo '/users'
@Controller('users')
export class UsersController {
    // Variables privadas para los casos de uso que este controlador necesita para cumplir su función
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) { }

    @Post()
    // Decorador Body para indicar que el DTO se recibirá en el cuerpo de la solicitud
    create(@Body() dto: CreateUserRequestDto) {
        return this.createUserUseCase.execute({
            email: dto.email,
            name: dto.name,
            role: dto.role,
        });
    }

    // Decoradores para proteger esta ruta, solo usuarios autenticados con rol de admin pueden acceder
    @Delete(':id')
    // Decorador Param para indicar que el ID del usuario a eliminar se recibirá como parámetro en la URL
    @UseGuards(JwtGuard, RolesGuard)
    // Decorador Roles para especificar que solo los usuarios con rol de ADMIN pueden acceder a esta ruta
    @Roles(UserRole.ADMIN)
    delete(
        @Param('id') targetUserId: string,
        @CurrentUser() requester: { id: string },
    ) {
        return this.deleteUserUseCase.execute({
            targetUserId,
            requesterId: requester.id,
        });
    }
}