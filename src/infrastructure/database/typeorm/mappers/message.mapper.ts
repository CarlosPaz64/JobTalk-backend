import { Message } from 'src/domain/entities/message.entity';
import { MessageOrmEntity } from '../entities/message.orm-entity';

export class MessageMapper {
    static toDomain(orm: MessageOrmEntity): Message {
        return new Message(
            orm.id,
            orm.chatId,
            orm.senderId,
            orm.content,
            orm.type,
            orm.fileUrl,
            orm.readByIds,
            orm.isDeleted,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    static toOrm(domain: Message): MessageOrmEntity {
        const orm = new MessageOrmEntity();
        orm.id = domain.id;
        orm.chatId = domain.chatId;
        orm.senderId = domain.senderId;
        orm.content = domain.content;
        orm.type = domain.type;
        orm.fileUrl = domain.fileUrl;
        orm.readByIds = domain.readByIds;
        orm.isDeleted = domain.isDeleted;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}