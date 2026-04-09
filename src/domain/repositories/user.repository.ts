/* User repository */
import { User } from '../entities/user.entity';

export interface IUserRepository {
    // Métodos para interactuar con la fuente de datos de usuarios
    findById(id: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
}

// Token de inyección de dependencias
export const USER_REPOSITORY = 'IUserRepository';