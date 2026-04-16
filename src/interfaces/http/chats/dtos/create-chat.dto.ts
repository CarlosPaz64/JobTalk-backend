/* DTO para crear un chat */
// Importaciones de class-validator para validación de datos
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsUUID,
    MinLength,
} from 'class-validator';
import { ChatType } from '../../../../domain/entities/chat.entity';

export class CreateChatRequestDto {
    // Decorador que define que el campo es una cadena de texto
    @IsString()
    @IsNotEmpty({ message: 'El nombre del chat es requerido' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    name!: string;

    // Decorador que define que el campo es un valor de un enum específico
    @IsEnum(ChatType, { message: 'El tipo debe ser private o global' })
    type!: ChatType;

    // Decoradores que definen que el campo es un array de UUIDs válidos
    @IsArray()
    // Decorador que valida que cada elemento del array sea un UUID versión 4
    @IsUUID('4', { each: true, message: 'Cada miembro debe ser un UUID válido' })
    // Array de IDs de miembros que formarán parte del chat
    memberIds!: string[];
}