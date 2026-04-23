/* DTO para el refresco del token */
// Exportaciones de class-validator para validar los datos de entrada del DTO
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenRequestDto {
    // Decorador IsString() para validar que el refreshToken es una cadena de texto, y IsNotEmpty() para asegurarse de que no esté vacío. El mensaje personalizado se muestra si la validación falla.
    @IsString()
    @IsNotEmpty({ message: 'El refresh token es requerido' })
    refreshToken: string;
}