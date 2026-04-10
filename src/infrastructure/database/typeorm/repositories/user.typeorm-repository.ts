import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from 'src/domain/repositories/user.repository';
import { User } from 'src/domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';
/* Contrato que implementa IUserRepository, para interactuar con la base de datos TypeORM */

// Decorador Injectable para que NestJS pueda inyectar esta clase como dependencia
@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
    constructor(
        // Decorador InjectRepository para inyectar el repositorio de TypeORM para la entidad UserOrmEntity
        @InjectRepository(UserOrmEntity)
        private readonly repo: Repository<UserOrmEntity>,
    ) { }

    // Método para encontrar un usuario por su ID, devuelve un objeto User o null si no se encuentra
    async findById(id: string): Promise<User | null> {
        // Constante orm que obtiene el usuario de la base de datos usando el repositorio de TypeORM, buscando por el campo 'id'
        const orm = await this.repo.findOne({ where: { id } });
        // Si se encuentra el usuario (orm no es null), se convierte a la entidad de dominio User usando el UserMapper, de lo contrario se devuelve null
        return orm ? UserMapper.toDomain(orm) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const orm = await this.repo.findOne({ where: { email } });
        return orm ? UserMapper.toDomain(orm) : null;
    }

    async findAll(): Promise<User[]> {
        // Constante que implementa el método findAll, que obtiene todos los usuarios de la base de datos usando el repositorio de TypeORM
        const orms = await this.repo.find();
        // Retorno de un array de usuarios, mapeando cada entidad ORM a la entidad de dominio User usando el UserMapper
        return orms.map(UserMapper.toDomain);
    }

    async save(user: User): Promise<User> {
        const orm = await this.repo.save(UserMapper.toOrm(user));
        return UserMapper.toDomain(orm);
    }

    async update(user: User): Promise<User> {
        const orm = await this.repo.save(UserMapper.toOrm(user));
        return UserMapper.toDomain(orm);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}