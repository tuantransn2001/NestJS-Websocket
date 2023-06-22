import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix(`/realtime/api/v1/`);
  await app.listen(process.env.PORT);
}
bootstrap();
