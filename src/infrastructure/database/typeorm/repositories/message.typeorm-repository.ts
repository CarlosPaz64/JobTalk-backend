import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IMessageRepository } from 'src/domain/repositories/message.repository';
import { Message } from 'src/domain/entities/message.entity';
import { MessageOrmEntity } from '../entities/message.orm-entity';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageTypeOrmRepository implements IMessageRepository {
    constructor(
        @InjectRepository(MessageOrmEntity)
        private readonly repo: Repository<MessageOrmEntity>,
    ) { }

    async findById(id: string): Promise<Message | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? MessageMapper.toDomain(orm) : null;
    }

    async findByChatId(chatId: string, limit: number, offset: number): Promise<Message[]> {
        const orms = await this.repo.find({
            where: { chatId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: offset,
        });
        return orms.map(MessageMapper.toDomain);
    }

    async save(message: Message): Promise<Message> {
        const orm = await this.repo.save(MessageMapper.toOrm(message));
        return MessageMapper.toDomain(orm);
    }

    async update(message: Message): Promise<Message> {
        const orm = await this.repo.save(MessageMapper.toOrm(message));
        return MessageMapper.toDomain(orm);
    }
}