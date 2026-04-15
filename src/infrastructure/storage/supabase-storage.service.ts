import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import 'multer';
// import * as express from 'express';

// Decorador Injectable marca esta clase como un proveedor que puede ser inyectado en otros lugares de la aplicación, lo que permite gestionar las dependencias de manera eficiente y seguir los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
@Injectable()
export class SupabaseStorageService {
    private readonly client: SupabaseClient;
    // Variable privada que representa el nombre del bucket de almacenamiento en Supabase, se inicializa en el constructor a partir de la configuración proporcionada por ConfigService, lo que permite mantener esta información fuera del código fuente y mejorar la seguridad y flexibilidad de la aplicación
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        // Se crea una instancia del cliente de Supabase utilizando las credenciales proporcionadas por ConfigService, lo que permite gestionar la conexión a Supabase de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        this.client = createClient(
            // Se obtienen las credenciales de Supabase desde la configuración, lo que permite mantener esta información fuera del código fuente y mejorar la seguridad y flexibilidad de la aplicación, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
            configService.getOrThrow<string>('SUPABASE_URL'),
            // La clave de servicio es necesaria para realizar operaciones de almacenamiento, y se obtiene de la configuración para mantenerla segura y fuera del código fuente, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
            configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );
        // Retorno del nombre del bucket de almacenamiento, que se obtiene de la configuración para mantenerlo seguro y fuera del código fuente, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        this.bucket = configService.getOrThrow<string>('SUPABASE_STORAGE_BUCKET');
    }

    // Método para subir un archivo a Supabase Storage, recibe un archivo de tipo Express.Multer.File y retorna una promesa que resuelve con la URL pública firmada del archivo subido, lo que permite gestionar el almacenamiento de archivos de manera eficiente y segura, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
    async uploadFile(file: Express.Multer.File): Promise<string> {
        // Generamos un nombre único para el archivo utilizando uuidv4, lo que garantiza que cada archivo tenga un nombre único y evita colisiones en el almacenamiento, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        const extension = file.originalname.split('.').pop();
        // El key es la ruta dentro del bucket donde se almacenará el archivo, en este caso se utiliza una carpeta "uploads" y un nombre único generado con uuidv4, lo que permite organizar los archivos de manera eficiente y evitar colisiones, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        const key = `uploads/${uuidv4()}.${extension}`;

        //  Manejo de errores al subir el archivo a Supabase Storage, si ocurre un error durante la subida, se lanza una excepción con un mensaje descriptivo, lo que permite gestionar los errores de manera eficiente y proporcionar retroalimentación adecuada a los usuarios o a otros componentes de la aplicación, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
        const { error } = await this.client.storage
            .from(this.bucket)
            .upload(key, file.buffer, {
                // mimetype se utiliza para especificar el tipo de contenido del archivo, lo que permite a Supabase Storage manejar el archivo de manera adecuada y proporcionar la información correcta al acceder a él, siguiendo los principios de inversión de dependencias y separación de responsabilidades en la arquitectura hexagonal
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new Error(`Error al subir archivo: ${error.message}`);
        }

        // Retornamos la URL pública firmada con 1 hora de expiración
        const { data, error: signedUrlError } = await this.client.storage
            .from(this.bucket)
            .createSignedUrl(key, 3600);

        if (signedUrlError || !data) {
            throw new Error(`Error al generar URL: ${signedUrlError?.message || 'No data'}`);
        }

        return data.signedUrl; // Aquí TypeScript ya sabe que data existe
    }

    async getSignedUrl(path: string): Promise<string> {
        const { data, error } = await this.client.storage
            .from(this.bucket)
            .createSignedUrl(path, 3600);

        if (error) {
            throw new Error(`Error al generar URL firmada: ${error.message}`);
        }

        return data.signedUrl;
    }

    async deleteFile(path: string): Promise<void> {
        const { error } = await this.client.storage
            .from(this.bucket)
            .remove([path]);

        if (error) {
            throw new Error(`Error al eliminar archivo: ${error.message}`);
        }
    }
}