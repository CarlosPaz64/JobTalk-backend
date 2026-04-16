/* DTO para agregar un miembro a un chat */
// Importaciones de class-validator para validación de datos
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddMemberRequestDto {
    @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
    @IsNotEmpty()
    userId!: string;
}