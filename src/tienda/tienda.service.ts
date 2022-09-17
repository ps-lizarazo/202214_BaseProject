import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-error';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly _tiendaRepository: Repository<TiendaEntity>,
  ) {}

  validarCiudadTienda(ciudad: string): boolean {
    return ciudad && ciudad.toUpperCase() === ciudad && ciudad.length === 3;
  }

  async findAll(): Promise<TiendaEntity[]> {
    return await this._tiendaRepository.find({
      relations: ['productos'],
    });
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tiendaEncontrada: TiendaEntity = await this._tiendaRepository.findOne(
      {
        where: { id },
        relations: ['productos'],
      },
    );
    if (!tiendaEncontrada) {
      throw new BusinessLogicException(
        'No existe la tienda con el id indicado',
        BusinessError.NOT_FOUND,
      );
    }
    return tiendaEncontrada;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (!this.validarCiudadTienda(tienda.ciudad)) {
      throw new BusinessLogicException(
        'La ciudad no es válida',
        BusinessError.BAD_REQUEST,
      );
    }
    const tiendaCreada: TiendaEntity = await this._tiendaRepository.save(
      tienda,
    );
    return tiendaCreada;
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const tiendaEncontrada: TiendaEntity = await this.findOne(id);
    if (!this.validarCiudadTienda(tienda.ciudad)) {
      throw new BusinessLogicException(
        'La ciudad no es válida',
        BusinessError.BAD_REQUEST,
      );
    }
    const tiendaActualizada: TiendaEntity = await this._tiendaRepository.save({
      ...tiendaEncontrada,
      ...tienda,
    });
    return tiendaActualizada;
  }

  async delete(id: string): Promise<void> {
    const tiendaEncontrada: TiendaEntity = await this.findOne(id);
    await this._tiendaRepository.remove(tiendaEncontrada);
  }
}
