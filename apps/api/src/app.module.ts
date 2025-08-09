import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { SeedController } from './seed.controller';

@Module({
  imports: [ProductsModule],
  controllers: [AppController, SeedController],
})
export class AppModule {}
