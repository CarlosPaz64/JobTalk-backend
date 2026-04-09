/* Message entity */
// Esta clase representa un mensaje en el sistema. Contiene propiedades y métodos relacionados con la lógica de negocio del mensaje.
// La clase Message es una entidad que representa un mensaje en el sistema. Contiene propiedades como id, chatId, senderId, content, type, fileUrl, readByIds, isDeleted
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

// La clase Message es una entidad que representa un mensaje en el sistema. Contiene propiedades como id, chatId, senderId, content, type, fileUrl, readByIds, isDeleted
export class Message {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    // El ID del usuario que envió el mensaje. Esto se utiliza para identificar al remitente del mensaje y para aplicar reglas de negocio relacionadas con el envío y la lectura de mensajes.
    public readonly senderId: string,
    // El contenido del mensaje, que puede ser texto o una descripción de un archivo adjunto. Esto se utiliza para mostrar el mensaje en la interfaz de usuario y para aplicar reglas de negocio relacionadas con la edición y eliminación de mensajes.
    public content: string,
    public type: MessageType,
    // La URL del archivo adjunto, si el mensaje es de tipo imagen, video o archivo. Esto se utiliza para mostrar el archivo adjunto en la interfaz de usuario y para aplicar reglas de negocio relacionadas con la gestión de archivos adjuntos.
    public fileUrl: string | null,
    // La lista de IDs de usuarios que han leído el mensaje. Esto se utiliza para mostrar el estado de lectura del mensaje en la interfaz de usuario y para aplicar reglas de negocio relacionadas con la lectura de mensajes.
    public readByIds: string[],
    public isDeleted: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  // Reglas de negocio
  markAsRead(userId: string): void {
    // Un mensaje solo puede ser marcado como leído por un usuario si el ID del usuario no está ya incluido en la lista de readByIds del mensaje. Esto evita que se intente marcar un mensaje como leído por un usuario que ya lo ha leído, lo que podría causar inconsistencias en el estado del mensaje.
    if (!this.readByIds.includes(userId)) {
        // Al marcar un mensaje como leído por un usuario, se añade su ID a la lista de readByIds del mensaje y se actualiza la fecha de actualización para reflejar el cambio de estado.
      this.readByIds.push(userId);
    }
  }

  // Un mensaje es leído por un usuario si su ID está incluido en la lista de readByIds del mensaje. Esto se utiliza para mostrar el estado de lectura del mensaje en la interfaz de usuario y para aplicar reglas de negocio relacionadas con la lectura de mensajes.
  isReadBy(userId: string): boolean {
    // La función includes() se utiliza para verificar si el ID del usuario está presente en la lista de readByIds del mensaje. Si el ID del usuario está incluido en la lista, significa que el usuario ha leído el mensaje.
    return this.readByIds.includes(userId);
  }

  // Un mensaje solo puede ser eliminado (soft delete) si no ha sido eliminado previamente. Esto evita que se intente eliminar un mensaje que ya ha sido eliminado, lo que podría causar inconsistencias en el estado del mensaje.
  softDelete(): void {
    // Antes de eliminar un mensaje, se verifica si el mensaje ya ha sido eliminado utilizando la propiedad isDeleted. Si el mensaje ya ha sido eliminado, se lanza un error para evitar eliminarlo nuevamente, lo que podría causar inconsistencias en el estado del mensaje.
    if (this.isDeleted) {
      throw new Error('El mensaje ya fue eliminado');
    }
    // Al eliminar un mensaje, se establece isDeleted en true, se actualiza el contenido del mensaje para indicar que fue eliminado, se elimina la URL del archivo adjunto (si existe) y se actualiza la fecha de actualización para reflejar el cambio de estado.
    this.isDeleted = true;
    this.content = 'Este mensaje fue eliminado';
    // Al eliminar un mensaje, se establece fileUrl en null para eliminar la referencia al archivo adjunto, lo que garantiza que el archivo adjunto ya no esté accesible a través del mensaje eliminado.
    this.fileUrl = null;
    this.updatedAt = new Date();
  }

  // Un mensaje tiene un archivo adjunto si su propiedad fileUrl no es null. Esto se utiliza para mostrar el archivo adjunto en la interfaz de usuario y para aplicar reglas de negocio relacionadas con la gestión de archivos adjuntos.
  hasFile(): boolean {
    // Un mensaje tiene un archivo adjunto si su propiedad fileUrl no es null. Esto se verifica comprobando si fileUrl es diferente de null. Si fileUrl es null, significa que el mensaje no tiene un archivo adjunto.
    return this.fileUrl !== null;
  }
}