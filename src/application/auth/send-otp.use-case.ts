import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { IOtpRepository, OTP_REPOSITORY } from '../../domain/repositories/otp.repository';
import { Email } from '../../domain/value-objects/email.vo';
import { Otp } from '../../domain/entities/otp.entity';
import { v4 as uuidv4 } from 'uuid';

export interface IMessagingService {
    sendOtp(email: string, code: string): Promise<string>;
}
export const MESSAGING_SERVICE = 'IMessagingService';

export interface SendOtpDto {
    email: string;
}

@Injectable()
export class SendOtpUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(OTP_REPOSITORY)
        private readonly otpRepository: IOtpRepository,
        @Inject(MESSAGING_SERVICE)
        private readonly messagingService: IMessagingService,
    ) { }

    async execute(dto: SendOtpDto): Promise<{ message: string }> {
        const email = new Email(dto.email);

        const user = await this.userRepository.findByEmail(email.getValue());
        if (!user) {
            throw new Error('No existe un usuario registrado con este correo electrónico');
        }

        // Invalidamos OTPs anteriores del mismo email
        await this.otpRepository.invalidateByEmail(email.getValue());

        // Generamos nuevo OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const otp = new Otp(
            uuidv4(),
            email.getValue(),
            code,
            expiresAt,
            false,
            new Date(),
        );

        // Guardamos en DB antes de enviar
        await this.otpRepository.save(otp);

        // Enviamos el correo
        await this.messagingService.sendOtp(email.getValue(), code);

        return { message: 'Correo de verificación enviado con éxito' };
    }
}