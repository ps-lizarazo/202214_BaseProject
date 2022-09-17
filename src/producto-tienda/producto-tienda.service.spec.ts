import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEntity } from '../producto/producto.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { ProductoTiendaService } from './producto-tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let producto: ProductoEntity;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.random.word(),
        direccion: faker.random.word(),
        ciudad: 'ABC',
      });
      tiendaList.push(tienda);
    }
    producto = await productoRepository.save({
      nombre: faker.random.word(),
      precio: faker.random.numeric(4),
      tipo: 'Perecedero',
      tiendas: tiendaList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add Store to Product', async () => {
    const tienda = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    const productoTienda = await service.addStoreToProduct(
      tienda.id,
      producto.id,
    );
    expect(productoTienda).toBeDefined();
    expect(productoTienda.tiendas.length).toBe(producto.tiendas.length + 1);
  });

  it('addStoreToProduct should throw an error when trying to add a non-existing store to a product', async () => {
    await expect(
      service.addStoreToProduct('1', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });

  it('addStoreToProduct should throw an error when trying to add a store to a non-existing product', async () => {
    const tienda = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    await expect(
      service.addStoreToProduct(tienda.id, '1'),
    ).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('findStoresFromProduct should return all stores from a product', async () => {
    const tiendas = await service.findStoresFromProduct(producto.id);
    expect(tiendas).toBeDefined();
    expect(tiendas.length).toBe(producto.tiendas.length);
  });

  it('findStoresFromProduct should throw an error when trying to find stores from a non-existing product', async () => {
    await expect(service.findStoresFromProduct('1')).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('findStoreFromProduct should return a store from a product', async () => {
    const tienda = await service.findStoreFromProduct(
      tiendaList[0].id,
      producto.id,
    );
    expect(tienda).toBeDefined();
    expect(tienda.id).toBe(tiendaList[0].id);
  });

  it('findStoreFromProduct should throw an error when trying to find a store from a non-existing product', async () => {
    await expect(
      service.findStoreFromProduct(tiendaList[0].id, '1'),
    ).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('findStoreFromProduct should throw an error when trying to find a non-existing store from a product', async () => {
    await expect(
      service.findStoreFromProduct('1', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });

  it('updateStoresFromProduct should update all stores from a product', async () => {
    const tienda = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    const tienda2 = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    const tienda3 = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    const productoActualizado = await service.updateStoresFromProduct(
      producto.id,
      [tienda, tienda2, tienda3],
    );
    expect(productoActualizado.tiendas).toBeDefined();
    expect(productoActualizado.tiendas.length).toBe(3);
  });

  it('updateStoresFromProduct should throw an error when trying to update stores from a non-existing product', async () => {
    const tienda = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    await expect(
      service.updateStoresFromProduct('1', [tienda]),
    ).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('updateStoresFromProduct should throw an error when trying to update non-existing stores', async () => {
    const tiendaInvalida: TiendaEntity = {
      id: '1',
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
      productos: [],
    };

    await expect(
      service.updateStoresFromProduct(producto.id, [tiendaInvalida]),
    ).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });

  it('deleteStoreFromProduct should delete a store from a product', async () => {
    await service.deleteStoreFromProduct(tiendaList[0].id, producto.id);

    const tiendas = await service.findStoresFromProduct(producto.id);
    expect(tiendas.length).toBe(producto.tiendas.length - 1);
  });

  it('deleteStoreFromProduct should throw an error when trying to delete a store from a non-existing product', async () => {
    await expect(
      service.deleteStoreFromProduct(tiendaList[0].id, '1'),
    ).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('deleteStoreFromProduct should throw an error when trying to delete a non-existing store from a product', async () => {
    await expect(
      service.deleteStoreFromProduct('1', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });

  it('deleteStoreFromProduct should throw an error for a non-associated store', async () => {
    const tienda = await tiendaRepository.save({
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
    });
    await expect(
      service.deleteStoreFromProduct(tienda.id, producto.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda no se encuentra asociada al producto',
    );
  });
});
