import { Otp } from 'src/domain/entities/otp.entity';
import { OtpOrmEntity } from '../entities/otp.orm-entity';

export class OtpMapper {
    static toDomain(orm: OtpOrmEntity): Otp {
        return new Otp(
            orm.id,
            orm.email,
            orm.code,
            orm.expiresAt,
            orm.isUsed,
            orm.createdAt,
        );
    }

    static toOrm(domain: Otp): OtpOrmEntity {
        const orm = new OtpOrmEntity();
        orm.id = domain.id;
        orm.email = domain.email;
        orm.code = domain.code;
        orm.expiresAt = domain.expiresAt;
        orm.isUsed = domain.isUsed;
        orm.createdAt = domain.createdAt;
        return orm;
    }
}