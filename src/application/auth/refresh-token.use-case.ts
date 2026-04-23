/* Módulo para el refresco del token */
// Decoradores e inyección de dependencias de NestJS para gestionar las dependencias de manera eficiente y seguir los principios de inversión de dependencias en la arquitectura hexagonal, lo que permite una mayor modularidad y facilidad de mantenimiento en la aplicación
import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { ITokenService, TOKEN_SERVICE } from './verify-otp.use-case';

// Interfaz que define la estructura del DTO (Data Transfer Object) para el refresco del token, lo que permite una comunicación clara y estructurada entre las capas de la aplicación, siguiendo los principios de diseño de software y facilitando la validación y transformación de datos en la capa de aplicación
export interface RefreshTokenDto {
  userId: string;
}

// Inserción del decorador Injectable marca esta clase como un servicio que puede ser inyectado en otras partes de la aplicación, lo que permite a NestJS gestionar su ciclo de vida y sus dependencias de manera eficiente, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
@Injectable()
// La clase RefreshTokenUseCase implementa la lógica de negocio para el refresco del token, lo que permite separar claramente la lógica de aplicación de la lógica de dominio y la infraestructura, siguiendo los principios de diseño de software y facilitando la mantenibilidad y escalabilidad de la aplicación
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) { }

  async execute(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if (!user.isActive) {
      throw new Error('Usuario inactivo');
    }

    return {
      accessToken: this.tokenService.generateAccessToken(user.id, user.role),
    };
  }
}