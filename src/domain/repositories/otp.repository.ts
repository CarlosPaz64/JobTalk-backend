import { Otp } from '../entities/otp.entity';

export interface IOtpRepository {
    save(otp: Otp): Promise<Otp>;
    findValidByEmail(email: string): Promise<Otp | null>;
    invalidateByEmail(email: string): Promise<void>;
}

export const OTP_REPOSITORY = 'IOtpRepository';