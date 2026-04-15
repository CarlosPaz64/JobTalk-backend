/* Guarida de roles */
// CanActivate es una interfaz que define el método canActivate, que se utiliza para determinar si una ruta puede ser accedida o no, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
// ExecutionContext es una interfaz que proporciona información sobre el contexto de ejecución de una ruta, como la solicitud HTTP, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// Reflector es una clase que proporciona métodos para acceder a los metadatos de las rutas, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../domain/value-objects/user-role.vo';

// ROLES_KEY es una constante que se utiliza como clave para almacenar los roles requeridos en los metadatos de las rutas, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
export const ROLES_KEY = 'roles';

@Injectable()
// Clase que implementa la interfaz CanActivate para definir un guard que verifica si el usuario tiene los roles necesarios para acceder a una ruta, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
export class RolesGuard implements CanActivate {
    // Constructor que recibe una instancia de Reflector para acceder a los metadatos de las rutas, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
    constructor(private readonly reflector: Reflector) { }

    // Método canActivate que se ejecuta para determinar si una ruta puede ser accedida o no, verifica los roles requeridos en los metadatos de la ruta y compara con el rol del usuario en la solicitud, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
    canActivate(context: ExecutionContext): boolean {
        // Constante que obtiene los roles requeridos de los metadatos de la ruta utilizando el Reflector, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            // Se utiliza la constante ROLES_KEY como clave para obtener los roles requeridos de los metadatos de la ruta, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
            ROLES_KEY,
            // Se pasan el handler y la clase del contexto para obtener los roles requeridos de los metadatos de la ruta, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
            [context.getHandler(), context.getClass()],
        );

        // Manejo de casos donde no se requieren roles para acceder a la ruta, si no hay roles requeridos, se permite el acceso, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        if (!requiredRoles) return true;

        // switch para verificar si el usuario tiene alguno de los roles requeridos, se obtiene el usuario de la solicitud y se compara su rol con los roles requeridos, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        const { user } = context.switchToHttp().getRequest();
        // Se retorna true si el rol del usuario está incluido en los roles requeridos, lo que permite gestionar la autorización de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        return requiredRoles.includes(user.role);
    }
}