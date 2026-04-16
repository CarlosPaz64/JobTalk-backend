/* DTO para crear un usuario */
// Importaciones de class-validator para verificar los datos de entrada
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { UserRole } from '../../../../domain/value-objects/user-role.vo';

export class CreateUserRequestDto {
    @IsEmail({}, { message: 'El email no tiene un formato válido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    name!: string;

    // Este decorador es opcional, ya que el rol por defecto será 'user' si no se proporciona
    @IsOptional()
    @IsEnum(UserRole, { message: 'El rol debe ser admin o user' })
    role?: UserRole;
}