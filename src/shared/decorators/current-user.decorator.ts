/* Decorador para obtener el usuario actual */
// create-param-decorator es una función de NestJS que permite crear decoradores personalizados para extraer datos de la solicitud HTTP. En este caso, el decorador CurrentUser se utiliza para obtener el usuario actual de la solicitud.
// ExecutionContext es una interfaz de NestJS que proporciona información sobre el contexto de ejecución de la solicitud, como la solicitud HTTP, la respuesta y otros detalles relacionados con la ejecución de la función del controlador.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    // El (_data: unknown) es un parámetro que no se utiliza en este caso, pero es necesario para cumplir con la firma de la función requerida por createParamDecorator. El ctx: ExecutionContext es el contexto de ejecución que se pasa a la función para acceder a la solicitud HTTP.
    (_data: unknown, ctx: ExecutionContext) => {
        // switchToHttp() es un método del ExecutionContext que permite cambiar el contexto a HTTP, lo que significa que se puede acceder a la solicitud HTTP. getRequest() es un método que devuelve la solicitud HTTP actual. Finalmente, se devuelve el usuario asociado con la solicitud, que generalmente se establece en algún punto del proceso de autenticación.
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);