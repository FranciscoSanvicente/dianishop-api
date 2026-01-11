import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const logger = new Logger("HttpExceptionFilter");

    if (!(exception instanceof HttpException)) {
      logger.error(`Error no controlado: ${exception instanceof Error ? exception.stack : exception}`);
    }

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = isHttp
      ? (exception as HttpException).getResponse()
      : { message: "Internal server error" };

    const payload = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      error:
        typeof errorResponse === "string"
          ? { message: errorResponse }
          : errorResponse,
    };

    response.status(status).json(payload);
  }
}
