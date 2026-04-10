/* Create User use case */
import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRole } from '../../domain/value-objects/user-role.vo';
import { v4 as uuidv4 } from 'uuid';

// Interfaz para el DTO de entrada del caso de uso
export interface CreateUserDto {
    email: string;
    name: string;
    // El rol es opcional, por defecto será USER, pero se puede especificar ADMIN si es necesario
    role?: UserRole;
}

// El caso de uso implementa la lógica de negocio para crear un nuevo usuario
@Injectable()
export class CreateUserUseCase {
    // Constructor para inyectar el repositorio de usuarios, que es una abstracción para acceder a los datos sin preocuparse por la implementación concreta
    constructor(
        // Decoramos la propiedad con @Inject para indicar que queremos inyectar una dependencia, y especificamos el token USER_REPOSITORY para que NestJS sepa qué implementar inyectar
        @Inject(USER_REPOSITORY)
        // El repositorio de usuarios es una dependencia externa que el dominio necesita para cumplir su función, pero no se preocupa por cómo se implementa
        private readonly userRepository: IUserRepository,
    ) { }

    // El método execute es el punto de entrada para ejecutar la lógica del caso de uso, recibe un DTO con los datos necesarios para crear el usuario y retorna el usuario creado
    async execute(dto: CreateUserDto): Promise<User> {
        // Validamos el formato del número antes de hacer cualquier llamada externa, si el formato es inválido el constructor de PhoneNumber lanzará un error que el controlador puede manejar adecuadamente
        const email = new Email(dto.email);
        // Verificamos si ya existe un usuario registrado con el mismo número de teléfono, si existe lanzamos un error para que el controlador pueda manejarlo adecuadamente
        const existing = await this.userRepository.findByEmail(email.getValue());
        // Si existe un usuario registrado con el mismo número de teléfono, lanzamos un error para que el controlador pueda manejarlo adecuadamente, evitando así la creación de usuarios duplicados
        if (existing) {
            throw new Error('Ya existe un usuario con este correo electrónico');
        }

        // Constante para la fecha actual, que se usará para los campos createdAt y updatedAt del usuario, asegurando que ambos campos tengan el mismo valor al momento de la creación
        const now = new Date();
        // Creamos una nueva instancia de User con los datos proporcionados en el DTO, generando un ID único con uuidv4, y estableciendo isVerified en false porque el usuario se verificará después mediante OTP, y isActive en true para que el usuario pueda iniciar sesión una vez verificado
        const user = new User(
            uuidv4(),
            email,
            // Trimamos el nombre para eliminar espacios en blanco al inicio y al final, asegurando que el nombre almacenado sea limpio y consistente
            dto.name.trim(),
            // Rol por defecto para los usuarios, si no se especifica en el DTO se asignará USER, pero si se proporciona un rol válido se usará ese valor, permitiendo flexibilidad en la creación de usuarios con diferentes roles
            dto.role ?? UserRole.USER,
            false,   // isVerified — se verifica después por OTP
            true,    // isActive
            // Fecha de creación y actualización inicial, ambos se establecen con la misma fecha actual para reflejar el momento de la creación del usuario, y el campo updatedAt se actualizará posteriormente cada vez que se modifique el usuario
            now,
            now,
        );

        // Guardamos el nuevo usuario en el repositorio, lo que persistirá los datos en la base de datos, y retornamos el usuario creado para que el controlador pueda enviar la respuesta adecuada al cliente
        return this.userRepository.save(user);
    }
}