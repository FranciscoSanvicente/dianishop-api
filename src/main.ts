import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType, Logger } from "@nestjs/common";
import helmet from "helmet";
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port") || 4000;
  const globalPrefix = configService.get<string>("app.globalPrefix") || "api";
  const swaggerEnabled = configService.get<boolean>("swagger.enabled");
  const corsEnabled = configService.get<boolean>("cors.enabled");
  const corsOrigin = configService.get<string[]>("cors.origin");
  const corsCredentials = configService.get<boolean>("cors.credentials");

  const logger = new Logger("Bootstrap");

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  app.use(helmet());

  // Configuración de CORS
  if (corsEnabled) {
    app.enableCors({
      origin: corsOrigin,
      credentials: corsCredentials,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "Cache-Control",
        "Pragma",
      ],
      exposedHeaders: ["X-Total-Count", "X-Page-Count"],
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle("E-commerce API")
      .setDescription("API básica de e-commerce")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  }

  await app.listen(port);
  logger.log(`🚀 App running on http://localhost:${port}/${globalPrefix}`);
  if (swaggerEnabled) {
    logger.log(`📘 Swagger: http://localhost:${port}/${globalPrefix}/docs`);
  }
}

bootstrap();
