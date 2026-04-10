/* ResendService */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMessagingService } from '../../application/auth/send-otp.use-case';
import { IOtpVerifier } from '../../application/auth/verify-otp.use-case';

// Este servicio será el responsable del envío de correos OTP por medio de Resend
@Injectable()
export class ResendService implements IMessagingService, IOtpVerifier {
    // Variable privada para la instancia del cliente de Resend
    private readonly client: Resend;
    // Almacén temporal en memoria — en producción esto iría en Redis o en la DB
    private readonly otpStore = new Map<string, { code: string; expiresAt: Date }>();

    constructor(private readonly configService: ConfigService) {
        this.client = new Resend(configService.get<string>('RESEND_API_KEY'));
    }

    async sendOtp(email: string, code: string): Promise<string> {
        // Guardamos el código con expiración de 10 minutos
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        this.otpStore.set(email, { code, expiresAt });

        const { data, error } = await this.client.emails.send({
            from: this.configService.get<string>('RESEND_FROM_EMAIL')!,
            // El '!' es para asegurarle a TypeScript que esta variable no será undefined, ya que debe estar configurada
            to: email,
            subject: 'Tu código de acceso - JobTalk',
            html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Tu código de verificación</h2>
          <p>Usa el siguiente código para ingresar a JobTalk. Expira en 10 minutos.</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; 
                      text-align: center; padding: 24px; background: #f4f4f5; 
                      border-radius: 8px; margin: 24px 0;">
            ${code}
          </div>
          <p style="color: #71717a; font-size: 14px;">
            Si no solicitaste este código, ignora este mensaje.
          </p>
        </div>
      `,
        });

        if (error) {
            throw new Error('Error al enviar el correo OTP');
        }

        return data.id;
    }

    async verifyOtp(email: string, code: string): Promise<boolean> {
        const stored = this.otpStore.get(email);
        if (!stored) return false;

        const isExpired = new Date() > stored.expiresAt;
        const isMatch = stored.code === code;

        if (isMatch && !isExpired) {
            // Lo eliminamos para que no pueda reutilizarse
            this.otpStore.delete(email);
            return true;
        }

        return false;
    }
}