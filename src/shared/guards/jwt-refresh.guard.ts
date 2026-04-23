/* Guarida para el token de refresco JWT */
import { Injectable } from '@nestjs/common';
// AuthGuard es una clase de NestJS que se utiliza para proteger rutas y controlar el acceso a ellas. En este caso, se extiende la clase AuthGuard con la estrategia 'jwt-refresh' que se ha definido previamente en JwtRefreshStrategy. Esto significa que cualquier ruta protegida con JwtRefreshGuard requerirá un token de refresco JWT válido para acceder a ella.
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// La clase JwtRefreshGuard extiende la clase AuthGuard de Passport, utilizando la estrategia 'jwt-refresh' que se ha definido previamente en JwtRefreshStrategy. Esto permite proteger las rutas que requieren un token de refresco JWT válido para acceder a ellas.
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') { }