/* Message repository */
// Contrato para el repositorio de mensajes
import { Message } from '../entities/message.entity';

export interface IMessageRepository {
    // Métodos para interactuar con la fuente de datos de mensajes
    findById(id: string): Promise<Message | null>;
    findByChatId(chatId: string, limit: number, offset: number): Promise<Message[]>;
    save(message: Message): Promise<Message>;
    update(message: Message): Promise<Message>;
}

// Token de inyección de dependencias
export const MESSAGE_REPOSITORY = 'IMessageRepository';