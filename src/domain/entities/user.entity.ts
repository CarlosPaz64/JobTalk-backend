/* User entity */
// Esta clase representa a un usuario en el sistema. Contiene propiedades y métodos relacionados con la lógica de negocio del usuario.
import { PhoneNumber } from '../value-objects/phone-number.vo';
import { UserRole } from '../value-objects/user-role.vo';

// La clase User es una entidad que representa a un usuario en el sistema. Contiene propiedades como id, phoneNumber, name, role, isVerified, isActive, createdAt y updatedAt. Además, tiene métodos para verificar si el usuario es admin, si puede enviar mensajes, desactivar al usuario, verificar al usuario y actualizar su nombre. Estas reglas de negocio aseguran que el estado del usuario se mantenga consistente y que las operaciones se realicen de manera controlada.
export class User {
  constructor(
    public readonly id: string,
    public readonly phoneNumber: PhoneNumber,
    public name: string,
    // El rol del usuario puede ser 'admin' o 'user', lo que determina sus permisos en el sistema.
    public role: UserRole,
    // isVerified indica si el usuario ha verificado su cuenta, lo que puede ser necesario para ciertas acciones como enviar mensajes.
    public isVerified: boolean,
    // isActive indica si el usuario está activo en el sistema. Un usuario inactivo no podrá realizar ciertas acciones.
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  // Reglas de negocio
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  // Un usuario puede enviar mensajes solo si está verificado y activo.
  canSendMessages(): boolean {
    return this.isVerified && this.isActive;
  }

  // Un usuario solo puede ser desactivado si actualmente está activo. Esto evita que se intente desactivar un usuario que ya está inactivo, lo que podría causar inconsistencias en el estado del usuario.
  deactivate(): void {
    if (!this.isActive) {
      throw new Error('El usuario ya está inactivo');
    }
    // Al desactivar al usuario, se establece isActive en false y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.isActive = false;
    this.updatedAt = new Date();
  }

  // Un usuario solo puede ser verificado si actualmente no está verificado. Esto evita que se intente verificar un usuario que ya está verificado, lo que podría causar inconsistencias en el estado del usuario.
  verify(): void {
    if (this.isVerified) {
      throw new Error('El usuario ya está verificado');
    }
    // Al verificar al usuario, se establece isVerified en true y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.isVerified = true;
    this.updatedAt = new Date();
  }

  // Un usuario solo puede actualizar su nombre si el nuevo nombre es válido (no vacío y con al menos 2 caracteres). Esto asegura que el nombre del usuario se mantenga consistente y que no se establezcan nombres inválidos.
  updateName(name: string): void {
    // Validación del nuevo nombre: debe tener al menos 2 caracteres y no puede ser solo espacios en blanco. Esto garantiza que el nombre del usuario sea significativo y no cause problemas de visualización o identificación.
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    // Al actualizar el nombre del usuario, se asigna el nuevo nombre (después de eliminar espacios en blanco) y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.name = name.trim();
    this.updatedAt = new Date();
  }
}