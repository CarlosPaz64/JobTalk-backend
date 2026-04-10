/* Verify OTP use case */
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';

// Puerto de salida — el dominio define qué necesita del servicio de tokens
export interface ITokenService {
    // Método para generar un token de acceso, el dominio no se preocupa por cómo se implementa
    generateAccessToken(userId: string, role: string): string;
    // Método para generar un token de refresco, el dominio no se preocupa por cómo se implementa
    generateRefreshToken(userId: string): string;
}

// Constante para identificar el servicio de tokens en la inyección de dependencias
export const TOKEN_SERVICE = 'ITokenService';

// Puerto de salida — el dominio define qué necesita del verificador de OTP
export interface IOtpVerifier {
    //  Método para verificar el OTP, el dominio no se preocupa por cómo se implementa
    verifyOtp(email: string, code: string): Promise<boolean>;
}

// Constante para identificar el verificador de OTP en la inyección de dependencias
export const OTP_VERIFIER = 'IOtpVerifier';

// Interfaz para el DTO de entrada del caso de uso
export interface VerifyOtpDto {
    email: string;
    code: string;
}

// El caso de uso implementa la lógica de negocio para verificar un OTP
@Injectable()
export class VerifyOtpUseCase {
    constructor(
        // Inyectamos el repositorio de usuarios para acceder a los datos necesarios
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        // Inyectamos el servicio de tokens para generar los tokens de acceso y refresco, también es una abstracción
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
        // Inyectamos el verificador de OTP para validar el código proporcionado, también es una abstracción
        @Inject(OTP_VERIFIER)
        private readonly otpVerifier: IOtpVerifier,
        // El constructor se encarga de recibir las dependencias necesarias para ejecutar la lógica del caso de uso, utilizando la inyección de dependencias de NestJS
    ) { }

    // El método execute es el punto de entrada para ejecutar la lógica del caso de uso
    async execute(dto: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string }> {
        // Validamos el formato del correo electrónico antes de hacer cualquier llamada externa
        const email = new Email(dto.email);

        // Verificamos el código OTP utilizando el verificador de OTP, si no es válido lanzamos un error para que el controlador pueda manejarlo adecuadamente
        const isValid = await this.otpVerifier.verifyOtp(email.getValue(), dto.code);
        // Si el código OTP no es válido o ha expirado, lanzamos un error para que el controlador pueda manejarlo adecuadamente
        if (!isValid) {
            throw new Error('Código OTP inválido o expirado');
        }

        // Si el código OTP es válido, buscamos al usuario asociado al correo electrónico proporcionado
        const user = await this.userRepository.findByEmail(email.getValue());
        // Si no existe un usuario registrado con el correo electrónico proporcionado, lanzamos un error para que el controlador pueda manejarlo adecuadamente
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Si el usuario existe pero no ha sido verificado, lo marcamos como verificado y actualizamos su estado en el repositorio
        if (!user.isVerified) {
            // El método verify del usuario se encarga de cambiar su estado a verificado, siguiendo las reglas de negocio definidas en la entidad
            user.verify();
            // Actualizamos el usuario en el repositorio para reflejar el cambio de estado, esto es necesario para que la próxima vez que se consulte el usuario se refleje que ya ha sido verificado
            await this.userRepository.update(user);
        }

        // Finalmente, generamos un token de acceso y un token de refresco utilizando el servicio de tokens, y los retornamos al controlador para que puedan ser enviados al cliente
        return {
            // El método generateAccessToken del servicio de tokens se encarga de crear un token de acceso con la información del usuario, como su ID y su rol, siguiendo las reglas de negocio definidas en el dominio
            accessToken: this.tokenService.generateAccessToken(user.id, user.role),
            // El método generateRefreshToken del servicio de tokens se encarga de crear un token de refresco con la información del usuario, como su ID, siguiendo las reglas de negocio definidas en el dominio
            refreshToken: this.tokenService.generateRefreshToken(user.id),
        };
    }
}