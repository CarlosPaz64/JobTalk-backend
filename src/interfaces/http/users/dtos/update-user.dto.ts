/* DTO para actualizar un usuario */
// Importaciones de class-validator para verificar los datos de entrada
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserRequestDto {
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    name?: string;
}