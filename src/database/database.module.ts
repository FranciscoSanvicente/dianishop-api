// src/database/database.module.ts
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";

// 👉 Importa todas las entidades que quieras registrar
import { Product } from "../modules/products/entities/product.entity";
import { ProductImages } from "../modules/products/entities/product-images.entity";
import { Brand } from "../modules/brands/entities/brand.entity";
import { Category } from "../modules/categories/entities/category.entity";
import { CategoriesImages } from "../modules/categories/entities/categories-images.entity";
import { SizeImages } from "../modules/upload/entities/size-images.entity";

@Module({
  imports: [
    // Si ya cargaste ConfigModule en app.module con isGlobal: true, esta línea es opcional
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión asíncrona: permite leer ConfigService y hacer lógica extra
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>("DATABASE_URL");
        if (!dbUrl) {
          throw new Error("DATABASE_URL no definida en el entorno (.env)");
        }

        // Parseamos la URL para obtener cada parte
        const url = new URL(dbUrl);
        const dialect = "postgres" as const;

        // Extracción segura (decodifica %40, %3A, etc.)
        const host = url.hostname;
        const port = Number(url.port || 5432);
        const username = decodeURIComponent(url.username);
        const password = decodeURIComponent(url.password);
        const database = url.pathname.replace("/", "");

        return {
          dialect,
          host,
          port,
          username,
          password,
          database,
          // Modelos a registrar (o usa autoLoadModels true)
          models: [
            Product,
            ProductImages,
            Brand,
            Category,
            CategoriesImages,
            SizeImages,
          ],
          autoLoadModels: true,
          synchronize: true, // temporalmente true para crear las nuevas tablas
          logging:
            config.get("NODE_ENV") === "development" ? console.log : false,
          define: {
            timestamps: true,
            underscored: false,
          },
          dialectOptions: {
            ssl: {
              require: true, // Neon, Supabase y muchos hostings lo exigen
              rejectUnauthorized: false, // desactiva validación de CA en local
            },
          },
        };
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
