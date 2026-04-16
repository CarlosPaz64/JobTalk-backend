/* Decorador para definir los roles requeridos para acceder a una ruta */
// SetMetadata es una función que se utiliza para definir metadatos personalizados en las rutas, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../domain/value-objects/user-role.vo';

// Simplemente un decorador llamado Roles que utiliza SetMetadata para definir los roles requeridos para acceder a una ruta, recibe un número variable de argumentos de tipo UserRole y los almacena en los metadatos de la ruta bajo la clave 'roles', lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);