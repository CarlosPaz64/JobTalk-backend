import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { IOtpRepository } from 'src/domain/repositories/otp.repository';
import { Otp } from 'src/domain/entities/otp.entity';
import { OtpOrmEntity } from '../entities/otp.orm-entity';
import { OtpMapper } from '../mappers/otp.mapper';

@Injectable()
export class OtpTypeOrmRepository implements IOtpRepository {
    constructor(
        @InjectRepository(OtpOrmEntity)
        private readonly repo: Repository<OtpOrmEntity>,
    ) { }

    async save(otp: Otp): Promise<Otp> {
        const orm = await this.repo.save(OtpMapper.toOrm(otp));
        return OtpMapper.toDomain(orm);
    }

    async findValidByEmail(email: string): Promise<Otp | null> {
        const orm = await this.repo.findOne({
            where: {
                email,
                isUsed: false,
                expiresAt: MoreThan(new Date()),
            },
            order: { createdAt: 'DESC' },
        });
        return orm ? OtpMapper.toDomain(orm) : null;
    }

    async invalidateByEmail(email: string): Promise<void> {
        await this.repo.update({ email, isUsed: false }, { isUsed: true });
    }
}