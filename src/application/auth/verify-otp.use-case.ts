import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { IOtpRepository, OTP_REPOSITORY } from '../../domain/repositories/otp.repository';
import { Email } from '../../domain/value-objects/email.vo';

export interface ITokenService {
    generateAccessToken(userId: string, role: string): string;
    generateRefreshToken(userId: string): string;
}
export const TOKEN_SERVICE = 'ITokenService';

export interface IOtpVerifier {
    verifyOtp(email: string, code: string): Promise<boolean>;
}
export const OTP_VERIFIER = 'IOtpVerifier';

export interface VerifyOtpDto {
    email: string;
    code: string;
}

@Injectable()
export class VerifyOtpUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        @Inject(OTP_REPOSITORY)
        private readonly otpRepository: IOtpRepository,
        @Inject(TOKEN_SERVICE)
        private readonly tokenService: ITokenService,
    ) { }

    async execute(dto: VerifyOtpDto): Promise<{ accessToken: string; refreshToken: string }> {
        const email = new Email(dto.email);

        // Buscamos el OTP válido en la DB
        const otp = await this.otpRepository.findValidByEmail(email.getValue());
        if (!otp) {
            throw new Error('Código OTP inválido o expirado');
        }

        // Validamos el código
        if (!otp.isValid(dto.code)) {
            throw new Error('Código OTP inválido o expirado');
        }

        // Marcamos como usado
        otp.markAsUsed();
        await this.otpRepository.save(otp);

        const user = await this.userRepository.findByEmail(email.getValue());
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (!user.isVerified) {
            user.verify();
            await this.userRepository.update(user);
        }

        return {
            accessToken: this.tokenService.generateAccessToken(user.id, user.role),
            refreshToken: this.tokenService.generateRefreshToken(user.id),
        };
    }
}