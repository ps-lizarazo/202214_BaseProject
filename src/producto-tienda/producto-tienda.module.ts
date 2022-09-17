import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoTiendaController } from './producto-tienda.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';

@Module({
  providers: [ProductoTiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity, ProductoEntity])],
  controllers: [ProductoTiendaController],
})
export class ProductoTiendaModule {}
