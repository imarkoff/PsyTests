import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class ControllerLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const handlerName = context.getHandler().name;
    const className = context.getClass().name;

    const logger = new Logger(`${className}.${handlerName}`);

    logger.log(`Incoming request: ${req.method} ${req.originalUrl}`);

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          logger.log(
            `Request handled successfully: ${req.method} ${req.originalUrl} - ${duration}ms`,
          );
        },
        error: (err: Error) => {
          const duration = Date.now() - startTime;
          logger.error(
            `Request handling failed: ${req.method} ${req.originalUrl} - ${duration}ms`,
            err.stack,
          );
        },
      }),
    );
  }
}
