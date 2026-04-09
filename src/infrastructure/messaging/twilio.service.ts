import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import {
  IMessagingService,
  IOtpVerifier,
} from '../../application/auth/send-otp.use-case';

@Injectable()
export class TwilioService implements IMessagingService, IOtpVerifier {
  private readonly client: twilio.Twilio;
  private readonly serviceSid: string;

  constructor(private readonly configService: ConfigService) {
    this.client = twilio.default(
      configService.get<string>('TWILIO_ACCOUNT_SID')!,
      configService.get<string>('TWILIO_AUTH_TOKEN')!,
    );
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