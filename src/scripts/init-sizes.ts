import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { SizeImagesService } from "../modules/upload/size-images.service";

async function initializeDefaultSizes() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sizeImagesService = app.get(SizeImagesService);

  try {
    console.log("🚀 Inicializando tamaños de imagen por defecto...");
    await sizeImagesService.initializeDefaultSizes();
    console.log("✅ Tamaños de imagen inicializados correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar tamaños:", error);
  } finally {
    await app.close();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  initializeDefaultSizes();
}

export { initializeDefaultSizes };
