import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from 'src/tienda/tienda.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaEntity } from '../tienda/tienda.entity';
import { ProductoTiendaService } from './producto-tienda.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly _productoTiendaService: ProductoTiendaService) {}

  @Post(':idProduct/stores/:idStore')
  async addStoreToProduct(
    @Param('idProduct') idProduct: string,
    @Param('idStore') idStore: string,
  ): Promise<ProductoEntity> {
    return await this._productoTiendaService.addStoreToProduct(
      idStore,
      idProduct,
    );
  }

  @Get(':idProduct/stores')
  async findStoresFromProduct(
    @Param('idProduct') idProduct: string,
  ): Promise<TiendaEntity[]> {
    return await this._productoTiendaService.findStoresFromProduct(idProduct);
  }

  @Get(':idProduct/stores/:idStore')
  async findStoreFromProduct(
    @Param('idProduct') idProduct: string,
    @Param('idStore') idStore: string,
  ): Promise<TiendaEntity> {
    return await this._productoTiendaService.findStoreFromProduct(
      idStore,
      idProduct,
    );
  }

  @Put(':idProduct/stores')
  async updateStoresFromProduct(
    @Param('idProduct') idProduct: string,
    @Body() tiendasDto: TiendaDto[],
  ): Promise<ProductoEntity> {
    const tiendas: TiendaEntity[] = plainToInstance(TiendaEntity, tiendasDto);
    return await this._productoTiendaService.updateStoresFromProduct(
      idProduct,
      tiendas,
    );
  }

  @Delete(':idProduct/stores/:idStore')
  async deleteStoreFromProduct(
    @Param('idProduct') idProduct: string,
    @Param('idStore') idStore: string,
  ): Promise<void> {
    await this._productoTiendaService.deleteStoreFromProduct(
      idStore,
      idProduct,
    );
  }
}
