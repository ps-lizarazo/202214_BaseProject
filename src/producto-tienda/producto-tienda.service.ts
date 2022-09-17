import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-error';

@Injectable()
export class ProductoTiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly _tiendaRepository: Repository<TiendaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly _productoRepository: Repository<ProductoEntity>,
  ) {}

  async addStoreToProduct(
    idTienda: string,
    idProducto: string,
  ): Promise<ProductoEntity> {
    const tiendaEncontrada: TiendaEntity = await this._tiendaRepository.findOne(
      { where: { id: idTienda }, relations: ['productos'] },
    );
    const productoEncontrado: ProductoEntity =
      await this._productoRepository.findOne({
        where: { id: idProducto },
        relations: ['tiendas'],
      });

    if (!tiendaEncontrada) {
      throw new BusinessLogicException(
        'No existe la tienda con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    if (!productoEncontrado) {
      throw new BusinessLogicException(
        'No existe el producto con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    productoEncontrado.tiendas = [
      ...productoEncontrado.tiendas,
      tiendaEncontrada,
    ];
    return await this._productoRepository.save(productoEncontrado);
  }

  async findStoresFromProduct(idProducto: string): Promise<TiendaEntity[]> {
    const productoEncontrado: ProductoEntity =
      await this._productoRepository.findOne({
        where: { id: idProducto },
        relations: ['tiendas'],
      });

    if (!productoEncontrado) {
      throw new BusinessLogicException(
        'No existe el producto con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }
    return productoEncontrado.tiendas;
  }

  async findStoreFromProduct(
    idTienda: string,
    idProducto: string,
  ): Promise<TiendaEntity> {
    const tiendaEncontrada: TiendaEntity = await this._tiendaRepository.findOne(
      { where: { id: idTienda }, relations: ['productos'] },
    );
    const productoEncontrado: ProductoEntity =
      await this._productoRepository.findOne({
        where: { id: idProducto },
        relations: ['tiendas'],
      });

    if (!tiendaEncontrada) {
      throw new BusinessLogicException(
        'No existe la tienda con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    if (!productoEncontrado) {
      throw new BusinessLogicException(
        'No existe el producto con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    const tiendaDelProducto = productoEncontrado.tiendas.find(
      (tienda) => tienda.id === tiendaEncontrada.id,
    );
    if (!tiendaDelProducto) {
      throw new BusinessLogicException(
        'La tienda no se encuentra asociada al producto',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return tiendaDelProducto;
  }

  async updateStoresFromProduct(
    idProducto: string,
    tiendas: TiendaEntity[],
  ): Promise<ProductoEntity> {
    const productoEncontrado: ProductoEntity =
      await this._productoRepository.findOne({
        where: { id: idProducto },
        relations: ['tiendas'],
      });

    if (!productoEncontrado) {
      throw new BusinessLogicException(
        'No existe el producto con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    //Validar que las tiendas existan
    for (const tienda of tiendas) {
      const tiendaEncontrada: TiendaEntity =
        await this._tiendaRepository.findOne({
          where: { id: tienda.id },
        });
      if (!tiendaEncontrada) {
        throw new BusinessLogicException(
          'No existe la tienda con el id indicado',
          BusinessError.NOT_FOUND,
        );
      }
    }

    productoEncontrado.tiendas = tiendas;
    return await this._productoRepository.save(productoEncontrado);
  }

  async deleteStoreFromProduct(
    idTienda: string,
    idProducto: string,
  ): Promise<void> {
    const tiendaEncontrada: TiendaEntity = await this._tiendaRepository.findOne(
      { where: { id: idTienda }, relations: ['productos'] },
    );
    const productoEncontrado: ProductoEntity =
      await this._productoRepository.findOne({
        where: { id: idProducto },
        relations: ['tiendas'],
      });

    if (!tiendaEncontrada) {
      throw new BusinessLogicException(
        'No existe la tienda con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    if (!productoEncontrado) {
      throw new BusinessLogicException(
        'No existe el producto con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }

    const tiendaDelProducto = productoEncontrado.tiendas.find(
      (tienda) => tienda.id === tiendaEncontrada.id,
    );
    if (!tiendaDelProducto) {
      throw new BusinessLogicException(
        'La tienda no se encuentra asociada al producto',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    productoEncontrado.tiendas = productoEncontrado.tiendas.filter(
      (tienda) => tienda.id !== tiendaEncontrada.id,
    );

    await this._productoRepository.save(productoEncontrado);
  }
}
