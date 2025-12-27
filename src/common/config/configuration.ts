export default () => ({
  app: {
    name: process.env.APP_NAME || "ecommerce-api",
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "4000", 10),
    globalPrefix: "api",
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  swagger: {
    enabled: (process.env.SWAGGER_ENABLED || "true") === "true",
  },
  cors: {
    enabled: (process.env.CORS_ENABLED || "true") === "true",
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:5173", // Vite default
          "http://localhost:8080", // Vue default
          "http://127.0.0.1:3000",
          "http://127.0.0.1:3001",
        ],
    credentials: (process.env.CORS_CREDENTIALS || "true") === "true",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});
