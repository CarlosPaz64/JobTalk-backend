/* Interceptor para transformar la respuesta */
// Todos estos imports de NestJS son necesarios para crear un interceptor personalizado. CallHandler es una interfaz que representa el siguiente manejador en la cadena de interceptores, ExecutionContext proporciona información sobre el contexto de ejecución de la solicitud, Injectable es un decorador que marca la clase como inyectable, NestInterceptor es una interfaz que define la estructura de un interceptor, Observable es una clase de RxJS que representa una secuencia de datos asíncrona, y map es un operador de RxJS que se utiliza para transformar los datos emitidos por un Observable.
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
// Observable es una clase de RxJS que representa una secuencia de datos asíncrona, y map es un operador de RxJS que se utiliza para transformar los datos emitidos por un Observable. En este caso, se utiliza para transformar la respuesta de la función del controlador antes de enviarla al cliente.
import { Observable } from 'rxjs';
// map es un operador de RxJS que se utiliza para transformar los datos emitidos por un Observable. En este caso, se utiliza para transformar la respuesta de la función del controlador antes de enviarla al cliente. La función map toma los datos emitidos por el Observable y los transforma en un nuevo objeto que incluye un campo success, el campo data con los datos originales y un campo timestamp con la fecha y hora actual en formato ISO.
import { map } from 'rxjs/operators';

// Tipado 'T' es un tipo genérico que permite que la interfaz ApiResponse y la clase TransformInterceptor sean flexibles y puedan trabajar con cualquier tipo de datos. Esto significa que puedes usar esta estructura para envolver cualquier tipo de respuesta que tu controlador pueda devolver, proporcionando una forma consistente de formatear las respuestas de tu API.
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

@Injectable()
// Clase que implementa a la interfaz NestInterceptor, y también utiliza el tipo genérico 'T' para permitir que el interceptor funcione con cualquier tipo de datos. El método intercept es el punto de entrada del interceptor, donde se recibe el contexto de ejecución y el siguiente manejador en la cadena de interceptores. La función next.handle() se llama para continuar con la ejecución normal del controlador, y luego se utiliza el operador map para transformar la respuesta antes de enviarla al cliente.
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    // El método intercept es el punto de entrada del interceptor, donde se recibe el contexto de ejecución y el siguiente manejador en la cadena de interceptores. La función next.handle() se llama para continuar con la ejecución normal del controlador, y luego se utiliza el operador map para transformar la respuesta antes de enviarla al cliente. La función map toma los datos emitidos por el Observable y los transforma en un nuevo objeto que incluye un campo success, el campo data con los datos originales y un campo timestamp con la fecha y hora actual en formato ISO.
    intercept(
        // El _context: ExecutionContext es el contexto de ejecución que se pasa a la función para acceder a la solicitud HTTP y otros detalles relacionados con la ejecución de la función del controlador. El next: CallHandler es el siguiente manejador en la cadena de interceptores, que se llama para continuar con la ejecución normal del controlador.
        _context: ExecutionContext,
        // El next: CallHandler es el siguiente manejador en la cadena de interceptores, que se llama para continuar con la ejecución normal del controlador. La función next.handle() se llama para continuar con la ejecución normal del controlador, y luego se utiliza el operador map para transformar la respuesta antes de enviarla al cliente. La función map toma los datos emitidos por el Observable y los transforma en un nuevo objeto que incluye un campo success, el campo data con los datos originales y un campo timestamp con la fecha y hora actual en formato ISO.
        next: CallHandler,
        // El método intercept devuelve un Observable que emite un objeto ApiResponse<T>, donde T es el tipo de datos original emitido por la función del controlador. Esto permite que el interceptor transforme la respuesta de la función del controlador en un formato consistente antes de enviarla al cliente.
    ): Observable<ApiResponse<T>> {
        // La función next.handle() se llama para continuar con la ejecución normal del controlador, y luego se utiliza el operador map para transformar la respuesta antes de enviarla al cliente. La función map toma los datos emitidos por el Observable y los transforma en un nuevo objeto que incluye un campo success, el campo data con los datos originales y un campo timestamp con la fecha y hora actual en formato ISO.
        return next.handle().pipe(
            // mapping de la respuesta para incluir un campo success, el campo data con los datos originales y un campo timestamp con la fecha y hora actual en formato ISO. Esto proporciona una estructura de respuesta consistente para todas las respuestas de la API, lo que facilita el manejo de las respuestas en el cliente.
            map((data) => ({
                success: true,
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}