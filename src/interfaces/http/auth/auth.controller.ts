/* Controlador de autenticación */
// Importaciones necesarias de NestJS para definir el controlador, manejar las solicitudes HTTP y usar los casos de uso
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { SendOtpUseCase } from '../../../application/auth/send-otp.use-case';
import { VerifyOtpUseCase } from '../../../application/auth/verify-otp.use-case';
import { SendOtpRequestDto } from './dtos/send-otp.dto';
import { VerifyOtpRequestDto } from './dtos/verify-otp.dto';

// Decorador que define esta clase como un controlador de NestJS, con la ruta base 'auth' para todas las rutas definidas en esta clase
@Controller('auth')
export class AuthController {
    constructor(
        private readonly sendOtpUseCase: SendOtpUseCase,
        private readonly verifyOtpUseCase: VerifyOtpUseCase,
    ) { }

    // Solicitud POST para enviar el OTP, con un código de respuesta HTTP 200 OK
    @Post('send-otp')
    // Código de respuesta HTTP 200 OK para indicar que la solicitud se ha procesado correctamente, incluso si el OTP no se envía (por ejemplo, si el usuario no existe, para evitar revelar información)
    @HttpCode(HttpStatus.OK)
    sendOtp(@Body() dto: SendOtpRequestDto) {
        return this.sendOtpUseCase.execute({ email: dto.email });
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    verifyOtp(@Body() dto: VerifyOtpRequestDto) {
        return this.verifyOtpUseCase.execute({
            email: dto.email,
            code: dto.code,
        });
    }
}