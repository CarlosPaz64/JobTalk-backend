/* Estrategia para el refresco del token JWT */
// UnauthorizedException se lanza cuando el token de refresco no es válido o el usuario no está activo
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Aquí utlizamos PassportStrategy para crear una nueva estrategia de autenticación basada en JWT, pero esta vez para el refresco del token
import { PassportStrategy } from '@nestjs/passport';
// ExtractJwt se utiliza para extraer el token JWT del header de la solicitud, y Strategy es la estrategia base de Passport para JWT
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';

// sub es el identificador del usuario que se encuentra en el payload del token de refresco, y se utiliza para validar el token y obtener la información del usuario correspondiente. En este caso, no es necesario incluir el role en el payload del token de refresco, ya que solo se necesita verificar la identidad del usuario para emitir un nuevo token de acceso.
interface JwtPayload {
    sub: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        configService: ConfigService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userRepository.findById(payload.sub);
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Refresh token inválido');
        }
        return { id: user.id, role: user.role };
    }
}