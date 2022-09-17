import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TiendaController } from './tienda.controller';
import { TiendaEntity } from './tienda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [TiendaService],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  controllers: [TiendaController],
})
export class TiendaModule {}
