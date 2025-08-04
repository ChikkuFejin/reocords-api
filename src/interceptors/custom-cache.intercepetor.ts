import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { getFromCache, saveToCache } from '../helpers/cache-store';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const key = request.url;

    const cachedData = getFromCache(key);
    if (cachedData) {
      return of(cachedData);
    }

    return next.handle().pipe(
      tap((data) => {
        saveToCache(key, data, 30_000);
      }),
    );
  }
}
