/* OTP entity */
// Cambio de la verificación de número telefónico a correo electrónico
// OTP entity
export class Otp {
    constructor(
        public readonly id: string,
        // El correo electrónico al que se envió el OTP
        public readonly email: string,
        // El código OTP generado
        public readonly code: string,
        // La fecha y hora de expiración del OTP
        public readonly expiresAt: Date,
        // Indica si el OTP ya fue utilizado
        public isUsed: boolean,
        public readonly createdAt: Date,
    ) { }

    // Reglas de negocio
    isExpired(): boolean {
        // Un OTP se considera expirado si la fecha actual es mayor a la fecha de expiración
        return new Date() > this.expiresAt;
    }

    isValid(code: string): boolean {
        // Un OTP es válido si no ha sido utilizado, no ha expirado y el código coincide
        return !this.isUsed && !this.isExpired() && this.code === code;
    }

    markAsUsed(): void {
        // Marca el OTP como utilizado. Si el OTP ya fue utilizado o ha expirado, lanza un error.
        if (this.isUsed) {
            throw new Error('Este OTP ya fue utilizado');
        }
        // Si el OTP ha expirado, no se puede marcar como usado y se lanza un error.
        if (this.isExpired()) {
            throw new Error('Este OTP ha expirado');
        }
        // Si el OTP es válido, se marca como utilizado.
        this.isUsed = true;
    }
}