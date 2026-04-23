import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from './infrastructure/database/database.module';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { TokenService } from './infrastructure/auth/token.service';
import { SupabaseStorageService } from './infrastructure/storage/supabase-storage.service';

import { AuthController } from './interfaces/http/auth/auth.controller';
import { UsersController } from './interfaces/http/users/users.controller';
import { ChatsController } from './interfaces/http/chats/chats.controller';
import { ChatGateway } from './interfaces/websocket/chat.gateway';

import { SendOtpUseCase } from './application/auth/send-otp.use-case';
import { VerifyOtpUseCase } from './application/auth/verify-otp.use-case';
import { CreateUserUseCase } from './application/users/create-user.use-case';
import { DeleteUserUseCase } from './application/users/delete-user.use-case';
import { CreateChatUseCase } from './application/chats/create-chat.use-case';
import { AddMemberUseCase } from './application/chats/add-member.use-case';
import { SendMessageUseCase } from './application/messages/send-message.use-case';

import { JwtRefreshStrategy } from './infrastructure/auth/jwt-refresh.strategy';
import { RefreshTokenUseCase } from './application/auth/refresh-token.use-case';

import { TOKEN_SERVICE } from './application/auth/verify-otp.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({}),
    DatabaseModule,
  ],
  controllers: [AuthController, UsersController, ChatsController],
  providers: [
    // Estrategia JWT
    JwtStrategy,

    // Token service
    { provide: TOKEN_SERVICE, useClass: TokenService },
    TokenService,

    // Storage
    SupabaseStorageService,

    // Casos de uso — Auth
    SendOtpUseCase,
    VerifyOtpUseCase,

    // Casos de uso — Users
    CreateUserUseCase,
    DeleteUserUseCase,

    // Casos de uso — Chats
    CreateChatUseCase,
    AddMemberUseCase,

    // Casos de uso — Messages
    SendMessageUseCase,

    // WebSocket Gateway
    ChatGateway,

    // Estrategia para el refresco del token JWT
    JwtRefreshStrategy,
    RefreshTokenUseCase,
  ],
})
export class AppModule { }