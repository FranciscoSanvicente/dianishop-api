import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req: any = context.switchToHttp().getRequest();
    const { method, url } = req;

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        this.logger.log(`${method} ${url} ${ms}ms`);
      }),
    );
  }
}
