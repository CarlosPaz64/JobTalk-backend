import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IChatRepository } from 'src/domain/repositories/chat.repository';
import { Chat } from 'src/domain/entities/chat.entity';
import { ChatOrmEntity } from '../entities/chat.orm-entity';
import { ChatMapper } from '../mappers/chat.mapper';

@Injectable()
export class ChatTypeOrmRepository implements IChatRepository {
    constructor(
        @InjectRepository(ChatOrmEntity)
        private readonly repo: Repository<ChatOrmEntity>,
    ) { }

    async findById(id: string): Promise<Chat | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? ChatMapper.toDomain(orm) : null;
    }

    async findByMemberId(userId: string): Promise<Chat[]> {
        const orms = await this.repo.find();
        return orms
            .filter((orm) => orm.memberIds.includes(userId))
            .map(ChatMapper.toDomain);
    }

    async findAll(): Promise<Chat[]> {
        const orms = await this.repo.find();
        return orms.map(ChatMapper.toDomain);
    }

    async save(chat: Chat): Promise<Chat> {
        const orm = await this.repo.save(ChatMapper.toOrm(chat));
        return ChatMapper.toDomain(orm);
    }

    async update(chat: Chat): Promise<Chat> {
        const orm = await this.repo.save(ChatMapper.toOrm(chat));
        return ChatMapper.toDomain(orm);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }
}