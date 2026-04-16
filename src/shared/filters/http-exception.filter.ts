/* Filtro para manejar excepciones HTTP */
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
// Todas estas importaciones son necesarias para crear un filtro de excepciones en NestJS. ArgumentsHost se utiliza para acceder al contexto de ejecución de la solicitud, Catch es un decorador que indica que esta clase es un filtro de excepciones, ExceptionFilter es una interfaz que define el contrato para los filtros de excepciones, HttpException es una clase base para las excepciones HTTP en NestJS, HttpStatus proporciona códigos de estado HTTP predefinidos y Logger se utiliza para registrar información sobre las excepciones que ocurren. Además, se importan Request y Response de Express para manejar las solicitudes y respuestas HTTP.
import { Request, Response } from 'express';

// Este decorador sirve para indicar que esta clase es un filtro de excepciones que se aplicará a todas las excepciones que ocurran en la aplicación. Al implementar la interfaz ExceptionFilter, se debe definir el método catch, que se ejecutará cada vez que ocurra una excepción. En este método, se maneja la lógica para determinar el código de estado HTTP y el mensaje de error que se devolverá al cliente, así como para registrar la excepción utilizando el logger. Finalmente, se envía una respuesta JSON al cliente con los detalles del error.
@Catch()
// @Catch() sin argumentos indica que este filtro se aplicará a todas las excepciones, independientemente de su tipo. Esto significa que cualquier excepción que ocurra en la aplicación será capturada por este filtro y manejada según la lógica definida en el método catch.
export class AllExceptionsFilter implements ExceptionFilter {
    // Variable privada logger que se utiliza para registrar información sobre las excepciones que ocurren en la aplicación. Se instancia un nuevo Logger utilizando el nombre de la clase AllExceptionsFilter para identificar claramente los mensajes de registro relacionados con este filtro de excepciones.
    private readonly logger = new Logger(AllExceptionsFilter.name);

    // El método catch es el punto central de este filtro de excepciones. Se ejecuta cada vez que ocurre una excepción en la aplicación. El método recibe dos parámetros: exception, que es la excepción que se ha lanzado, y host, que es un objeto que proporciona acceso al contexto de ejecución de la solicitud. Dentro del método, se accede a la solicitud y respuesta HTTP utilizando el host, se determina el código de estado HTTP y el mensaje de error en función del tipo de excepción, se registra la información sobre la excepción utilizando el logger y finalmente se envía una respuesta JSON al cliente con los detalles del error.
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // La constante de estatus se determina verificando si la excepción es una instancia de HttpException. Si lo es, se obtiene el código de estado utilizando el método getStatus() de la excepción. Si no lo es, se asigna el código de estado HTTP 500 (INTERNAL_SERVER_ERROR) como valor predeterminado.
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception instanceof Error
                    ? exception.message
                    : 'Error interno del servidor';

        // Se registra un mensaje de error utilizando el logger, que incluye el método HTTP, la URL de la solicitud y el código de estado. Esto proporciona información útil para depurar y monitorear las excepciones que ocurren en la aplicación.
        this.logger.error(`${request.method} ${request.url} - ${status}`, exception);

        // Finalmente, se envía una respuesta JSON al cliente con los detalles del error, incluyendo el código de estado, la marca de tiempo, la ruta de la solicitud y el mensaje de error. Esto permite al cliente recibir información clara sobre lo que salió mal en la solicitud.
        response.status(status).json({
            statusCode: status,
            // Conversión del dato de la fecha a una cadena de texto en formato ISO utilizando el método toISOString() del objeto Date. Esto proporciona una representación legible de la fecha y hora en que ocurrió la excepción.
            timestamp: new Date().toISOString(),
            // path representa la ruta de la solicitud que causó la excepción. Se obtiene utilizando request.url, lo que permite al cliente saber qué endpoint o recurso específico provocó el error.
            path: request.url,
            message,
        });
    }
}