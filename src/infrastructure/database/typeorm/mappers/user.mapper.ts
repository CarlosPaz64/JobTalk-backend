import { User } from 'src/domain/entities/user.entity';
import { Email } from 'src/domain/value-objects/email.vo';
import { UserOrmEntity } from '../entities/user.orm-entity';

// El UserMapper es responsable de convertir entre la entidad de dominio User y la entidad de base de datos UserOrmEntity
export class UserMapper {
    // El método toDomain toma una entidad de base de datos UserOrmEntity y la convierte en una entidad de dominio User
    static toDomain(orm: UserOrmEntity): User {
        // Mapping de las propiedades de UserOrmEntity a User, incluyendo la conversión del correo electrónico a un objeto Email
        return new User(
            orm.id,
            new Email(orm.email),
            orm.name,
            orm.role,
            orm.isVerified,
            orm.isActive,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    // Misma lógica pero en sentido contrario, convierte una entidad de dominio User a una entidad de base de datos UserOrmEntity
    static toOrm(domain: User): UserOrmEntity {
        const orm = new UserOrmEntity();
        orm.id = domain.id;
        orm.email = domain.email.getValue();
        orm.name = domain.name;
        orm.role = domain.role;
        orm.isVerified = domain.isVerified;
        orm.isActive = domain.isActive;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}