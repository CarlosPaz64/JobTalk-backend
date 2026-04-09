import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from 'typeorm';
import { OtpChannel } from 'src/domain/entities/otp.entity';

@Entity('otps')
export class OtpOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    phone!: string;

    @Column()
    code!: string;

    @Column({ type: 'enum', enum: OtpChannel })
    channel!: OtpChannel;

    @Column()
    expiresAt!: Date;

    @Column({ default: false })
    isUsed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}