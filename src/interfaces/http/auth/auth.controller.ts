/* Controlador de autenticación */
// Importaciones necesarias de NestJS para definir el controlador, manejar las solicitudes HTTP y usar los casos de uso
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { SendOtpUseCase } from '../../../application/auth/send-otp.use-case';
import { VerifyOtpUseCase } from '../../../application/auth/verify-otp.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/refresh-token.use-case';
import { SendOtpRequestDto } from './dtos/send-otp.dto';
import { VerifyOtpRequestDto } from './dtos/verify-otp.dto';
import { JwtRefreshGuard } from 'src/shared/guards/jwt-refresh.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

// Decorador que define esta clase como un controlador de NestJS, con la ruta base 'auth' para todas las rutas definidas en esta clase
@Controller('auth')
export class AuthController {
    constructor(
        private readonly sendOtpUseCase: SendOtpUseCase,
        private readonly verifyOtpUseCase: VerifyOtpUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase,
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

    // Decorador para manejar la solicitud POST para el refresco del token, con un código de respuesta HTTP 200 OK, y utilizando el guard JwtRefreshGuard para proteger esta ruta y requerir un token de refresco JWT válido
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    // El decorador UseGuards se utiliza para aplicar el guard JwtRefreshGuard a esta ruta, lo que significa que cualquier solicitud a esta ruta deberá incluir un token de refresco JWT válido en el header de autorización para poder acceder a ella. Esto garantiza que solo los usuarios autenticados con un token de refresco válido puedan solicitar un nuevo token de acceso.
    @UseGuards(JwtRefreshGuard)
    // Refresco de token que utiliza el caso de uso RefreshTokenUseCase para generar un nuevo token de acceso basado en el ID del usuario obtenido del token de refresco JWT. El decorador CurrentUser se utiliza para extraer la información del usuario autenticado del token de refresco y pasarla como argumento a este método, lo que permite generar un nuevo token de acceso para ese usuario específico.
    refresh(@CurrentUser() user: { id: string }) {
        // Retorno del resultado del caso de uso RefreshTokenUseCase, que genera un nuevo token de acceso basado en el ID del usuario obtenido del token de refresco JWT. Esto permite a los usuarios autenticados con un token de refresco válido obtener un nuevo token de acceso sin tener que volver a autenticarse con su email y OTP.
        return this.refreshTokenUseCase.execute({ userId: user.id });
    }
}