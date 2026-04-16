/* Implementación de una estrategia de autenticación con JWT */
// Importaciones necesarias de NestJS y Passport
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Importaciones de Passport para la estrategia JWT
import { PassportStrategy } from '@nestjs/passport';
// Importación de la estrategia JWT de Passport
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';

// Interfaz local que define la estructura del payload que se espera en el JWT
interface JwtPayload {
    sub: string;
    role: string;
}

@Injectable()
// Implementación de la estrategia de autenticación JWT que extiende la clase PassportStrategy de Passport
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        // Constructor que recibe el ConfigService para acceder a las variables de entorno y el repositorio de usuarios para validar el JWT
        configService: ConfigService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {
        super({
            // Configuración de la estrategia JWT, indicando cómo extraer el token del header y cuál es la clave secreta para verificarlo
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // Como se sabe que el JWT_SECRET siempre estará definido (según la configuración del proyecto), se puede usar el operador de aserción no nula (!) para indicar que no será undefined
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Usuario no autorizado');
        }
        return { id: user.id, role: user.role };
    }
}   