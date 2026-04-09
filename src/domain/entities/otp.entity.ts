/* OTP entity */
// Esta clase representa un OTP generado para un número de teléfono específico, con un código, canal de envío, fecha de expiración y estado de uso. Contiene métodos para validar el OTP, marcarlo como usado y verificar si ha expirado.
export enum OtpChannel {
    SMS = 'sms',
    WHATSAPP = 'whatsapp',
}

// OTP entity
export class Otp {
    constructor(
        public readonly id: string,
        // El número de teléfono al que se envió el OTP
        public readonly phone: string,
        // El código OTP generado
        public readonly code: string,
        // El canal por el que se envió el OTP (SMS o WhatsApp)
        public readonly channel: OtpChannel,
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