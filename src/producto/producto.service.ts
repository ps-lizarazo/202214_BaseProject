import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-error';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Injectable()
export class ProductoService {
  _tiposProducto: string[] = ['Perecedero', 'No Perecedero'];

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly _productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this._productoRepository.find({
      relations: ['tiendas'],
    });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const productoEncontrado: ProductoEntity =
      await this._productoRepository.findOne({
        where: { id },
        relations: ['tiendas'],
      });
    if (!productoEncontrado) {
      throw new BusinessLogicException(
        'No existe el producto con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }
    return productoEncontrado;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (producto.tipo && !this._tiposProducto.includes(producto.tipo)) {
      throw new BusinessLogicException(
        'El tipo de producto no es válido',
        BusinessError.BAD_REQUEST,
      );
    }
    const productoCreado: ProductoEntity = await this._productoRepository.save(
      producto,
    );
    return productoCreado;
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const productoEncontrado: ProductoEntity = await this.findOne(id);
    if (producto.tipo && !this._tiposProducto.includes(producto.tipo)) {
      throw new BusinessLogicException(
        'El tipo de producto no es válido',
        BusinessError.BAD_REQUEST,
      );
    }
    const productoActualizado: ProductoEntity =
      await this._productoRepository.save({
        ...productoEncontrado,
        ...producto,
      });
    return productoActualizado;
  }

  async delete(id: string): Promise<void> {
    const productoEncontrado: ProductoEntity = await this.findOne(id);
    await this._productoRepository.remove(productoEncontrado);
  }
}
