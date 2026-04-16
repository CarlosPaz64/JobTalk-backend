/* DTO para verificar OTP */
// Todas estas importaciones de class-validator son necesarias para validar los campos del DTO, asegurando que el email tenga un formato correcto, que no esté vacío y que el código OTP tenga exactamente 6 dígitos.
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpRequestDto {
    @IsEmail({}, { message: 'El email no tiene un formato válido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'El código OTP es requerido' })
    @Length(6, 6, { message: 'El código debe tener exactamente 6 dígitos' })
    code!: string;
}