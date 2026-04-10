// Puerto de entrada — el controlador o resolver llama a este caso de uso
// Inject e Injectable son decoradores de NestJS para la inyección de dependencias
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-objects/email.vo';

// Puerto de salida — el dominio define qué necesita del servicio de mensajería
export interface IMessagingService {
    // Método para enviar el OTP, el dominio no se preocupa por cómo se implementa
    sendOtp(email: string, code: string): Promise<string>;
}

// Puerto de salida — el dominio define qué necesita para verificar el OTP
// export interface IOtpVerifier {
    // Método para verificar el OTP, el dominio no se preocupa por cómo se implementa
  //  verifyOtp(email: string, code: string): Promise<boolean>;
//}

// Constante para identificar el servicio de mensajería en la inyección de dependencias
export const MESSAGING_SERVICE = 'IMessagingService';

export interface SendOtpDto {
  email: string;
}

// Constante para identificar el verificador de OTP en la inyección de dependencias
// export const OTP_VERIFIER = 'IOtpVerifier';


// Interfaz para el DTO de entrada del caso de uso
export interface SendOtpDto {
    phone: string;
    channel: 'sms' | 'whatsapp';
}

// El caso de uso implementa la lógica de negocio para enviar un OTP
// @Injectable marca esta clase como un proveedor que puede ser inyectado en otros lugares de la aplicación
@Injectable()
export class SendOtpUseCase {
    constructor(
        // Inyectamos el repositorio de usuarios para acceder a los datos necesarios
        @Inject(USER_REPOSITORY)
        // El repositorio es una abstracción que nos permite acceder a los datos sin preocuparnos por la implementación concreta
        private readonly userRepository: IUserRepository,
        // Inyectamos el servicio de mensajería para enviar el OTP, también es una abstracción
        @Inject(MESSAGING_SERVICE)
        // El servicio de mensajería es una dependencia externa que el dominio necesita para cumplir su función, pero no se preocupa por cómo se implementa
        private readonly messagingService: IMessagingService,
    ) { }

    // El método execute es el punto de entrada para ejecutar la lógica del caso de uso
    async execute(dto: SendOtpDto): Promise<{ message: string }> {
        // Validamos el formato del correo electrónico antes de hacer cualquier llamada externa
        const email = new Email(dto.email);

        // Verificamos si existe un usuario registrado con el correo electrónico proporcionado
        const user = await this.userRepository.findByEmail(email.getValue());
        // Si no existe un usuario, lanzamos un error para que el controlador pueda manejarlo adecuadamente
        if (!user) {
            throw new Error('No existe un usuario registrado con este correo electrónico');
        }

        // Generación del código OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Aquí podríamos guardar el OTP en la base de datos con su fecha de expiración, pero para simplificarlo, solo lo enviamos directamente

        // Si el usuario existe, procedemos a enviar el OTP utilizando el servicio de mensajería|
        await this.messagingService.sendOtp(email.getValue(), code);

        // Retornamos un mensaje de éxito indicando que el OTP ha sido enviado por el canal especificado
        return { message: "Correo de verificación enviado con éxito" };
    }
}