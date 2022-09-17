import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';

@Module({
  providers: [ProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductoController],
})
export class ProductoModule {}
