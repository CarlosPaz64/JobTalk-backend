import { Module } from '@nestjs/common';
// Module para integrar TypeORM con NestJS, lo que facilita la configuración y el uso de la base de datos en la aplicación
import { TypeOrmModule } from '@nestjs/typeorm';
// TypeOrmModule se utiliza para configurar la conexión a la base de datos y registrar las entidades y repositorios que se utilizarán en la aplicación
import { ConfigModule, ConfigService } from '@nestjs/config';
// ConfigModule y ConfigService se utilizan para gestionar las variables de entorno y la configuración de la aplicación, lo que permite mantener las credenciales y otros detalles de configuración fuera del código fuente, mejorando la seguridad y la flexibilidad de la aplicación

import { UserOrmEntity } from './typeorm/entities/user.orm-entity';
import { ChatOrmEntity } from './typeorm/entities/chat.orm-entity';
import { MessageOrmEntity } from './typeorm/entities/message.orm-entity';
import { OtpOrmEntity } from './typeorm/entities/otp.orm-entity';

import { UserTypeOrmRepository } from './typeorm/repositories/user.typeorm-repository';
import { ChatTypeOrmRepository } from './typeorm/repositories/chat.typeorm-repository';
import { MessageTypeOrmRepository } from './typeorm/repositories/message.typeorm-repository';

import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { CHAT_REPOSITORY } from '../../domain/repositories/chat.repository';
import { MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';

import { ResendService } from '../messaging/resend.service';

import { MESSAGING_SERVICE } from '../../application/auth/send-otp.use-case';
import { OTP_VERIFIER } from '../../application/auth/verify-otp.use-case';

import { SupabaseStorageService } from '../storage/supabase-storage.service';

// Decorador Module marca esta clase como un módulo de NestJS, lo que permite organizar el código en módulos lógicos y gestionar las dependencias de manera eficiente, siguiendo los principios de modularidad y separación de responsabilidades en la aplicación
@Module({
    // Se realizan los importes necesarios para configurar la conexión a la base de datos y registrar las entidades y repositorios que se utilizarán en la aplicación, lo que permite a NestJS gestionar la inyección de dependencias y el ciclo de vida de estos componentes de manera eficiente, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            // useFactory es una función que se utiliza para configurar la conexión a la base de datos de manera asíncrona, lo que permite acceder a las variables de entorno a través del ConfigService para configurar los detalles de la conexión, como el host, el puerto, el usuario, la contraseña y el nombre de la base de datos, lo que mejora la seguridad y la flexibilidad de la aplicación al mantener estos detalles fuera del código fuente
            useFactory: (config: ConfigService) => ({
                // Espera que sea PostgreSQL, pero se puede cambiar fácilmente a otro tipo de base de datos compatible con TypeORM simplemente cambiando el valor de "type" y ajustando los detalles de la conexión según sea necesario, lo que demuestra la flexibilidad y la capacidad de adaptación de la aplicación a diferentes entornos y requisitos de base de datos
                type: 'postgres',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USER'),
                password: config.get<string>('DB_PASS'),
                database: config.get<string>('DB_NAME'),
                entities: [UserOrmEntity, ChatOrmEntity, MessageOrmEntity, OtpOrmEntity],
                synchronize: config.get<string>('NODE_ENV') !== 'production',
            }),
        }),
        TypeOrmModule.forFeature([
            UserOrmEntity,
            ChatOrmEntity,
            MessageOrmEntity,
            OtpOrmEntity,
        ]),
    ],
    providers: [
        // Aquí ocurre la magia del DIP:
        // NestJS inyectará UserTypeOrmRepository cada vez que alguien pida USER_REPOSITORY
        { provide: MESSAGING_SERVICE, useClass: ResendService },
        { provide: OTP_VERIFIER, useClass: ResendService },
        { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
        { provide: CHAT_REPOSITORY, useClass: ChatTypeOrmRepository },
        { provide: MESSAGE_REPOSITORY, useClass: MessageTypeOrmRepository },
        UserTypeOrmRepository,
        ChatTypeOrmRepository,
        MessageTypeOrmRepository,
        ResendService,
        SupabaseStorageService,
    ],
    // Al exportar los repositorios con sus tokens de inyección, permitimos que otros módulos que importen DatabaseModule puedan acceder a estos repositorios a través de la inyección de dependencias, lo que facilita la reutilización y la integración de la capa de persistencia en toda la aplicación, siguiendo los principios de modularidad y separación de responsabilidades en la arquitectura hexagonal
    exports: [USER_REPOSITORY, CHAT_REPOSITORY, MESSAGE_REPOSITORY, MESSAGING_SERVICE, OTP_VERIFIER, SupabaseStorageService, UserTypeOrmRepository, ChatTypeOrmRepository, MessageTypeOrmRepository, ResendService],
})
export class DatabaseModule { }