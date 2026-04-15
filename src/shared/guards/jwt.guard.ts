/* Guarida de los tokens JWT */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Añadido del decorador Injectable para marcar esta clase como un proveedor que puede ser inyectado en otros lugares de la aplicación, lo que permite gestionar las dependencias de manera eficiente y seguir los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    // Esta clase extiende de AuthGuard con la estrategia 'jwt', lo que significa que se utilizará la estrategia de autenticación JWT para proteger las rutas que utilicen este guard, permitiendo gestionar la autenticación de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
}