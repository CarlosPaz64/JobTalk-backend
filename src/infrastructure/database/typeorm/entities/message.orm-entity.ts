import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { MessageType } from 'src/domain/entities/message.entity';

@Entity('messages')
export class MessageOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column('uuid')
    chatId!: string;

    @Column('uuid')
    senderId!: string;

    @Column('text')
    content!: string;

    @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
    type!: MessageType;

    @Column({ nullable: true })
    fileUrl!: string | null;

    @Column('simple-array', { default: '' })
    readByIds!: string[];

    @Column({ default: false })
    isDeleted!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}