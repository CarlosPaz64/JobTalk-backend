import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import {
  IMessagingService,
  IOtpVerifier,
} from '../../application/auth/send-otp.use-case';

// El servicio de Twilio implementa tanto el envío de OTP como la verificación, cumpliendo con las interfaces definidas en el dominio
@Injectable()
// TwilioService es una implementación concreta de los puertos de salida definidos en el dominio, lo que permite al caso de uso interactuar con Twilio sin conocer los detalles de la implementación
export class TwilioService implements IMessagingService, IOtpVerifier {
  private readonly client: twilio.Twilio;
  private readonly serviceSid: string;

  // El constructor inyecta el ConfigService para acceder a las variables de entorno necesarias para configurar el cliente de Twilio
  constructor(private readonly configService: ConfigService) {
    this.client = twilio.default(
      configService.get<string>('TWILIO_ACCOUNT_SID')!,
      configService.get<string>('TWILIO_AUTH_TOKEN')!,
    );
    // El serviceSid es el identificador del servicio de verificación de Twilio, que se utiliza para enviar y verificar OTPs
    this.serviceSid = configService.get<string>('TWILIO_VERIFY_SERVICE_SID')!;
  }

  async sendOtp(phone: string, channel: 'sms' | 'whatsapp'): Promise<string> {
    const verification = await this.client.verify.v2
      .services(this.serviceSid)
      .verifications.create({ to: phone, channel });
    return verification.sid;
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const result = await this.client.verify.v2
      .services(this.serviceSid)
      .verificationChecks.create({ to: phone, code });
    return result.status === 'approved';
  }
}