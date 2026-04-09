/* Chat entity */
// Esta clase representa un chat en el sistema. Contiene propiedades y métodos relacionados con la lógica de negocio del chat.
// La clase Chat es una entidad que representa un chat en el sistema. Contiene propiedades como id, name, type, createdById, memberIds, isActive, createdAt y updatedAt. Además, tiene métodos para verificar si el chat es global, si un usuario es miembro del chat, agregar un miembro al chat, eliminar un miembro del chat y renombrar el chat. Estas reglas de negocio aseguran que el estado del chat se mantenga consistente y que las operaciones se realicen de manera controlada.
export enum ChatType {
    // Un chat privado es un chat entre dos usuarios, mientras que un chat global es un chat al que pueden unirse múltiples usuarios. Esto determina las reglas de negocio para agregar y eliminar miembros del chat.
  PRIVATE = 'private',
  // Un chat global es un chat al que pueden unirse múltiples usuarios, mientras que un chat privado es un chat entre dos usuarios. Esto determina las reglas de negocio para agregar y eliminar miembros del chat.
  GLOBAL = 'global',
}

// La clase Chat es una entidad que representa un chat en el sistema. Contiene propiedades como id, name, type, createdById, memberIds, isActive, createdAt y updatedAt. Además, tiene métodos para verificar si el chat es global, si un usuario es miembro del chat, agregar un miembro al chat, eliminar un miembro del chat y renombrar el chat. Estas reglas de negocio aseguran que el estado del chat se mantenga consistente y que las operaciones se realicen de manera controlada.
export class Chat {
    // El constructor de la clase Chat inicializa las propiedades del chat, como id, name, type, createdById, memberIds, isActive, createdAt y updatedAt. Estas propiedades son esenciales para definir el estado del chat y su comportamiento en el sistema.
  constructor(
    public readonly id: string,
    public name: string,
    // El tipo del chat puede ser 'private' o 'global', lo que determina las reglas de negocio para agregar y eliminar miembros del chat.
    public type: ChatType,
    public readonly createdById: string,
    public memberIds: string[],
    // isActive indica si el chat está activo en el sistema. Un chat inactivo no podrá realizar ciertas acciones, como enviar mensajes o agregar miembros.
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  // Reglas de negocio
  isGlobal(): boolean {
    // Un chat es global si su tipo es ChatType.GLOBAL. Esto determina las reglas de negocio para agregar y eliminar miembros del chat, ya que un chat global puede tener múltiples miembros, mientras que un chat privado solo puede tener dos miembros.
    return this.type === ChatType.GLOBAL;
  }

  // Un usuario es miembro del chat si su ID está incluido en la lista de memberIds del chat. Esto se utiliza para verificar si un usuario tiene acceso al chat y puede participar en él.
  hasMember(userId: string): boolean {
    // La función includes() se utiliza para verificar si el ID del usuario está presente en la lista de memberIds del chat. Si el ID del usuario está incluido en la lista, significa que el usuario es miembro del chat y tiene acceso a él.
    return this.memberIds.includes(userId);
  }

  // Un usuario solo puede ser agregado al chat si no es miembro del chat. Esto evita que se intente agregar un usuario que ya es miembro, lo que podría causar inconsistencias en el estado del chat.
  addMember(userId: string): void {
    // Antes de agregar un nuevo miembro al chat, se verifica si el usuario ya es miembro del chat utilizando el método hasMember(). Si el usuario ya es miembro, se lanza un error para evitar agregarlo nuevamente, lo que podría causar inconsistencias en el estado del chat.
    if (this.hasMember(userId)) {
      throw new Error('El usuario ya es miembro de este chat');
    }
    // Al agregar un nuevo miembro al chat, se añade su ID a la lista de memberIds del chat y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.memberIds.push(userId);
    this.updatedAt = new Date();
  }

  // Un usuario solo puede ser eliminado del chat si es miembro del chat y no es el creador del chat. Esto evita que se intente eliminar a un usuario que no es miembro, lo que podría causar inconsistencias en el estado del chat, y también evita que se elimine al creador del chat, lo que podría causar problemas de gestión del chat.
  removeMember(userId: string): void {
    // Antes de eliminar un miembro del chat, se verifica si el usuario es miembro del chat utilizando el método hasMember(). Si el usuario no es miembro, se lanza un error para evitar eliminar a un usuario que no tiene acceso al chat, lo que podría causar inconsistencias en el estado del chat.
    if (!this.hasMember(userId)) {
      throw new Error('El usuario no es miembro de este chat');
    }
    // Además, se verifica si el ID del usuario que se intenta eliminar es el mismo que el ID del creador del chat (createdById). Si el usuario que se intenta eliminar es el creador del chat, se lanza un error para evitar eliminar al creador, lo que podría causar problemas de gestión del chat.
    if (userId === this.createdById) {
      throw new Error('No se puede eliminar al creador del chat');
    }
    // Al eliminar un miembro del chat, se filtra su ID de la lista de memberIds del chat y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.memberIds = this.memberIds.filter((id) => id !== userId);
    this.updatedAt = new Date();
  }

  // Un chat solo puede ser renombrado si el nuevo nombre es válido (no vacío y con al menos 2 caracteres). Esto asegura que el nombre del chat se mantenga consistente y que no se establezcan nombres inválidos.
  rename(name: string): void {
    // Validación del nuevo nombre: debe tener al menos 2 caracteres y no puede ser solo espacios en blanco. Esto garantiza que el nombre del chat sea significativo y no cause problemas de visualización o identificación.
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre del chat debe tener al menos 2 caracteres');
    }
    // Al renombrar el chat, se asigna el nuevo nombre (después de eliminar espacios en blanco) y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.name = name.trim();
    this.updatedAt = new Date();
  }
}