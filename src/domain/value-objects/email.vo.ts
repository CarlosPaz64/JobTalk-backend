/* Value Object para el email */
export class Email {
  // El valor del email se almacena en minúsculas y sin espacios
  private readonly value: string;

  // Expresión regular simple para validar el formato del email
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Constructor que valida y normaliza el email
  constructor(email: string) {
    // Limpieza del email: eliminar espacios y convertir a minúsculas
    const cleaned = email.trim().toLowerCase();
    // Si el email no coincide con la expresión regular, se lanza un error
    if (!Email.EMAIL_REGEX.test(cleaned)) {
      throw new Error(`Email inválido: ${cleaned}`);
    }
    // Retonrna el email limpio y validado
    this.value = cleaned;
  }

  // Obtiene el valor del email
  getValue(): string {
    return this.value;
  }

  // Método para comparar dos objetos Email
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  // Conversión a string para facilitar su uso en otras partes del código
  toString(): string {
    return this.value;
  }
}