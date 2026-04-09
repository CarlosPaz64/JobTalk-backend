/* Chat repository */
// Contrato para el repositorio de chats
import { Chat } from '../entities/chat.entity';

export interface IChatRepository {
    // Métodos para interactuar con la fuente de datos de chats
    findById(id: string): Promise<Chat | null>;
    findByMemberId(userId: string): Promise<Chat[]>;
    findAll(): Promise<Chat[]>;
    save(chat: Chat): Promise<Chat>;
    update(chat: Chat): Promise<Chat>;
    delete(id: string): Promise<void>;
}

// Token de inyección de dependencias
export const CHAT_REPOSITORY = 'IChatRepository';