import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Before...');
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        console.log(`After... ${Date.now() - now}ms`);
        return data;
      }),
    );
  }
}
