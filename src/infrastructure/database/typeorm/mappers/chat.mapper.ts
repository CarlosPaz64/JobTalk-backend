import { Chat } from 'src/domain/entities/chat.entity';
import { ChatOrmEntity } from '../entities/chat.orm-entity';

export class ChatMapper {
    static toDomain(orm: ChatOrmEntity): Chat {
        return new Chat(
            orm.id,
            orm.name,
            orm.type,
            orm.createdById,
            orm.memberIds,
            orm.isActive,
            orm.createdAt,
            orm.updatedAt,
        );
    }

    static toOrm(domain: Chat): ChatOrmEntity {
        const orm = new ChatOrmEntity();
        orm.id = domain.id;
        orm.name = domain.name;
        orm.type = domain.type;
        orm.createdById = domain.createdById;
        orm.memberIds = domain.memberIds;
        orm.isActive = domain.isActive;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}