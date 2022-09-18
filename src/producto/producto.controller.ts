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
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly _productoService: ProductoService) {}

  @Get()
  async findAll(): Promise<ProductoEntity[]> {
    return await this._productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductoEntity> {
    return await this._productoService.findOne(id);
  }

  @Post()
  async create(@Body() productoDto: ProductoDto): Promise<ProductoEntity> {
    const producto: ProductoEntity = plainToClass(ProductoEntity, productoDto);
    return await this._productoService.create(producto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = plainToClass(ProductoEntity, productoDto);
    return await this._productoService.update(id, producto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this._productoService.delete(id);
  }
}
