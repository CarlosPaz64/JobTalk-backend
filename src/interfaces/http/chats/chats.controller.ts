/* Controlador para gestionar las operaciones relacionadas con los chats */
// Importaciones de NestJS para los controladores, servicios y DTOs
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
import { CreateChatUseCase } from '../../../application/chats/create-chat.use-case';
import { AddMemberUseCase } from '../../../application/chats/add-member.use-case';
import { CreateChatRequestDto } from './dtos/create-chat.dto';
import { AddMemberRequestDto } from './dtos/add-member.dto';

// Decorador que define esta clase como un controlador de NestJS para la ruta 'chats'
@Controller('chats')
// Decorador que aplica los guards de autenticación y autorización a todas las rutas de este controlador
@UseGuards(JwtGuard, RolesGuard)
export class ChatsController {
    constructor(
        private readonly createChatUseCase: CreateChatUseCase,
        private readonly addMemberUseCase: AddMemberUseCase,
    ) { }

    @Post()
    // Decorador que indica que esta ruta solo puede ser accedida por usuarios con el rol de ADMIN
    @Roles(UserRole.ADMIN)
    create(
        @Body() dto: CreateChatRequestDto,
        @CurrentUser() requester: { id: string },
    ) {
        return this.createChatUseCase.execute({
            name: dto.name,
            type: dto.type,
            createdById: requester.id,
            memberIds: dto.memberIds,
        });
    }

    @Post(':chatId/members')
    @Roles(UserRole.ADMIN)
    addMember(
        @Param('chatId') chatId: string,
        @Body() dto: AddMemberRequestDto,
        @CurrentUser() requester: { id: string },
    ) {
        return this.addMemberUseCase.execute({
            chatId,
            userIdToAdd: dto.userId,
            requesterId: requester.id,
        });
    }

    @Delete(':chatId/members/:userId')
    @Roles(UserRole.ADMIN)
    removeMember(
        @Param('chatId') _chatId: string,
        @Param('userId') _userId: string,
    ) {
        // Use case de remove member lo añadimos en la siguiente iteración
        return { message: 'Miembro eliminado' };
    }
}