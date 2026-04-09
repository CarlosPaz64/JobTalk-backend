// Value Object para el número de teléfono
export class PhoneNumber {
    // Valor del número de teléfono en formato E.164
  private readonly value: string;

  // Formato E.164: +521234567890
  private static readonly E164_REGEX = /^\+[1-9]\d{7,14}$/;

  // Constructor que valida el número de teléfono y lo asigna al valor
  constructor(phone: string) {
    // Elimina espacios en blanco y valida el formato E.164
    const cleaned = phone.trim();
    // Validación del formato E.164
    if (!PhoneNumber.E164_REGEX.test(cleaned)) {
      throw new Error(`Número de teléfono inválido: ${cleaned}. Debe estar en formato E.164`);
    }
    // Asigna el número de teléfono limpio al valor
    this.value = cleaned;
  }

  // Método para obtener el valor del número de teléfono
  getValue(): string {
    return this.value;
  }

  // Método para comparar dos objetos PhoneNumber
  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  // Método para representar el número de teléfono como una cadena
  toString(): string {
    return this.value;
  }
}