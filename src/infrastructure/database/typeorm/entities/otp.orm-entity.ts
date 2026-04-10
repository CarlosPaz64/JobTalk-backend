import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from 'typeorm';

@Entity('otps')
export class OtpOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    email!: string;

    @Column()
    code!: string;

    @Column()
    expiresAt!: Date;

    @Column({ default: false })
    isUsed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}