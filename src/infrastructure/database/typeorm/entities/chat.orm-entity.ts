import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ChatType } from 'src/domain/entities/chat.entity';

@Entity('chats')
export class ChatOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ type: 'enum', enum: ChatType })
    type!: ChatType;

    @Column('uuid')
    createdById!: string;

    @Column('simple-array')
    memberIds!: string[];

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}