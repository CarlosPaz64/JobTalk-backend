import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMessagingService } from '../../application/auth/send-otp.use-case';

@Injectable()
export class ResendService implements IMessagingService {
    private readonly client: Resend;

    constructor(private readonly configService: ConfigService) {
        this.client = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    }

    async sendOtp(email: string, code: string): Promise<string> {
        const { data, error } = await this.client.emails.send({
            from: this.configService.get<string>('RESEND_FROM_EMAIL'),
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
            console.error('Resend error:', JSON.stringify(error, null, 2));
            throw new Error(`Error al enviar el correo OTP: ${error.message}`);
        }

        return data?.id ?? '';
    }
}