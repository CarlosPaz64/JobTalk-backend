/* Servicio para la generación y verificación de tokens JWT */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenService } from '../../application/auth/verify-otp.use-case';

export class TokenService implements ITokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    generateAccessToken(userId: string, role: string): string {
        const secret = this.configService.get<string>('JWT_SECRET');
        const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

        // Validación de seguridad: si faltan en el .env, lanzamos error
        if (!secret || !expiresIn) {
            throw new Error('JWT_SECRET o JWT_EXPIRES_IN no están definidos en el entorno');
        }

        return this.jwtService.sign(
            { sub: userId, role },
            {
                secret: secret,
                expiresIn: expiresIn as any, // 'as any' para evitar el conflicto de tipos de la librería
            },
        );
    }

    generateRefreshToken(userId: string): string {
        const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
        const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

        if (!secret || !expiresIn) {
            throw new Error('JWT_REFRESH_SECRET o JWT_REFRESH_EXPIRES_IN no están definidos');
        }

        return this.jwtService.sign(
            { sub: userId },
            {
                secret: secret,
                expiresIn: expiresIn as any,
            },
        );
    }
}