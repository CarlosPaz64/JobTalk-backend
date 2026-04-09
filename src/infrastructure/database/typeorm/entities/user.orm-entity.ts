import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/domain/value-objects/user-role.vo';

// Decorador @Entity indica que esta clase es una entidad de la base de datos y se mapeará a la tabla 'users'
@Entity('users')
// La clase UserOrmEntity representa la estructura de la tabla 'users' en la base de datos
export class UserOrmEntity {
    // Decorador @PrimaryColumn indica que esta propiedad es la clave primaria de la tabla y se generará como un UUID
    @PrimaryColumn('uuid')
    // El uso de '!' después del nombre de la propiedad indica que esta propiedad es obligatoria y no puede ser null o undefined
    id!: string;

    // Decorador @Column indica que esta propiedad se mapeará a una columna en la tabla 'users' y debe ser única
    @Column({ unique: true })
    phone!: string;

    @Column()
    name!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role!: UserRole;

    @Column({ default: false })
    isVerified!: boolean;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
// Básicamente, TypeORM es una traducción de la estructura de la base de datos a una clase de TypeScript, lo que facilita la manipulación de los datos en la aplicación sin tener que escribir consultas SQL directamente.