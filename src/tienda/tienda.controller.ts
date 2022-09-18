import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaDto } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
  constructor(private readonly _tiendaService: TiendaService) {}

  @Get()
  async findAll(): Promise<TiendaEntity[]> {
    return await this._tiendaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TiendaEntity> {
    return await this._tiendaService.findOne(id);
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDto): Promise<TiendaEntity> {
    const tienda: TiendaEntity = plainToClass(TiendaEntity, tiendaDto);
    return await this._tiendaService.create(tienda);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() tiendaDto: TiendaDto,
  ): Promise<TiendaEntity> {
    const tienda: TiendaEntity = plainToClass(TiendaEntity, tiendaDto);
    return await this._tiendaService.update(id, tienda);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this._tiendaService.delete(id);
  }
}
