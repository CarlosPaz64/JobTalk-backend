/* DTO para enviar OTP */
// IsEmail es un decorador de class-validator que se utiliza para validar que el valor del campo email tenga un formato de correo electrónico válido. IsNotEmpty es otro decorador de class-validator que se utiliza para validar que el campo email no esté vacío. En este caso, ambos decoradores se aplican al campo email para asegurarse de que se proporcione un correo electrónico válido y no esté vacío.
// isNotEmpty es un decorador de class-validator que se utiliza para validar que el campo email no esté vacío. En este caso, se aplica al campo email para asegurarse de que se proporcione un correo electrónico y no esté vacío. Si el campo email está vacío, se generará un error de validación con el mensaje 'El email es requerido'.
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpRequestDto {
    @IsEmail({}, { message: 'El email no tiene un formato válido' })
    @IsNotEmpty({ message: 'El email es requerido' })
    // El campo email es de tipo string y se marca como obligatorio con el operador de aserción no nulo (!). Esto significa que se espera que se proporcione un valor para el campo email al crear una instancia de SendOtpRequestDto, y si no se proporciona, se generará un error de validación debido a los decoradores IsEmail e IsNotEmpty.
    email!: string;
}