import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import Multer from 'multer';

// Decorador Injectable marca esta clase como un proveedor que puede ser inyectado en otros lugares de la aplicación
@Injectable()
export class S3Service {
    // S3Client es el cliente de AWS SDK para interactuar con S3, bucket es el nombre del bucket donde se almacenarán los archivos
    private readonly client: S3Client;
    private readonly bucket: string;

    // Constructor privado que inyecta el ConfigService para acceder a las variables de entorno necesarias para configurar el cliente de S3 y el nombre del bucket
    constructor(private readonly configService: ConfigService) {
        // Instancia de S3Client configurada con las credenciales y región obtenidas del ConfigService, lo que permite al servicio interactuar con S3 sin exponer detalles de configuración en el código
        this.client = new S3Client({
            region: configService.get<string>('AWS_REGION')!,
            credentials: {
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID')!,
                secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
            },
        });
        // El nombre del bucket se obtiene del ConfigService, lo que permite cambiar el bucket sin modificar el código, simplemente cambiando la variable de entorno correspondiente
        this.bucket = configService.get<string>('AWS_S3_BUCKET')!;
    }

    // Uso de Multer para manejar la carga de archivos, aunque en este caso no se utiliza directamente en el servicio, se puede integrar fácilmente con un controlador que reciba archivos a través de HTTP
    async uploadFile(file: Express.Multer.File): Promise<string> {
        // Constante "llave" que define la ruta y el nombre del archivo en S3, utilizando uuidv4 para generar un identificador único y evitar colisiones de nombres, lo que garantiza que cada archivo subido tenga un nombre único en el bucket
        const key = `uploads/${uuidv4()}-${file.originalname}`;

        // El comando PutObjectCommand se utiliza para subir el archivo a S3, especificando el bucket, la clave (nombre del archivo) y el contenido del archivo, lo que permite almacenar el archivo en S3 de manera eficiente y segura
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                // mimetype del archivo para que S3 lo reconozca correctamente, lo que facilita la gestión de archivos y su posterior recuperación con el tipo de contenido adecuado
                ContentType: file.mimetype,
            }),
        );

        // Retorna la URL pública del archivo subido, lo que permite acceder al archivo directamente a través de la URL generada, facilitando su uso en la aplicación sin necesidad de realizar una solicitud adicional para obtener la URL después de subir el archivo
        return `https://${this.bucket}.s3.amazonaws.com/${key}`;
    }

    // Método para obtener una URL pre-firmada para subir un archivo directamente a S3 desde el cliente, lo que permite a los clientes subir archivos directamente a S3 sin pasar por el servidor, mejorando la eficiencia y reduciendo la carga en el servidor
    async getPresignedUrl(key: string): Promise<string> {
        // Constante "command" que define el comando PutObjectCommand para generar la URL pre-firmada, especificando el bucket y la clave (nombre del archivo), lo que permite generar una URL que los clientes pueden usar para subir archivos directamente a S3 con permisos limitados y un tiempo de expiración definido
        const command = new PutObjectCommand({ Bucket: this.bucket, Key: key });
        // Retorna la URL pre-firmada generada por getSignedUrl, con un tiempo de expiración de 3600 segundos (1 hora), lo que garantiza que la URL solo sea válida por un período limitado, mejorando la seguridad al evitar que las URLs pre-firmadas sean utilizadas indefinidamente
        return getSignedUrl(this.client, command, { expiresIn: 3600 });
    }

    // Método para eliminar un archivo de S3, lo que permite gestionar el ciclo de vida de los archivos almacenados en S3, eliminando aquellos que ya no son necesarios y evitando costos innecesarios por almacenamiento
    async deleteFile(key: string): Promise<void> {
        // El comando DeleteObjectCommand se utiliza para eliminar el archivo especificado por la clave (nombre del archivo) del bucket, lo que permite eliminar archivos de S3 de manera eficiente y segura, asegurando que los archivos que ya no son necesarios sean removidos del almacenamiento
        await this.client.send(
            // El comando DeleteObjectCommand se utiliza para eliminar el archivo especificado por la clave (nombre del archivo) del bucket, lo que permite eliminar archivos de S3 de manera eficiente y segura, asegurando que los archivos que ya no son necesarios sean removidos del almacenamiento
            new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
        );
    }
}