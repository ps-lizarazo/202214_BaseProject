import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.random.word(),
        direccion: faker.random.word(),
        ciudad: 'ABC',
      });
      tiendasList.push(tienda);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all stores', async () => {
    const tiendas = await service.findAll();
    expect(tiendas).toBeDefined();
    expect(tiendas.length).toBe(tiendasList.length);
  });

  it('should return one store', async () => {
    const tienda = await service.findOne(tiendasList[0].id);
    expect(tienda).toBeDefined();
    expect(tienda.nombre).toBe(tiendasList[0].nombre);
    expect(tienda.direccion).toBe(tiendasList[0].direccion);
    expect(tienda.ciudad).toBe(tiendasList[0].ciudad);
  });

  it('should throw an error when trying to find a non-existing store', async () => {
    await expect(service.findOne('1')).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });

  it('should create a store', async () => {
    const tienda = await service.create({
      id: '',
      nombre: faker.random.word(),
      direccion: faker.random.word(),
      ciudad: 'ABC',
      productos: [],
    });
    expect(tienda).toBeDefined();

    const tiendaFound = await service.findOne(tienda.id);
    expect(tiendaFound).toBeDefined();
  });

  it('should throw an error when trying to create a store with invalid ciudad', async () => {
    await expect(
      service.create({
        id: '',
        nombre: faker.random.word(),
        direccion: faker.random.word(),
        ciudad: 'INVALIDO',
        productos: [],
      }),
    ).rejects.toHaveProperty('message', 'La ciudad no es válida');
  });

  it('should update a store', async () => {
    const tienda = tiendasList[0];
    tienda.nombre = faker.random.word();
    tienda.direccion = faker.random.word();

    const tiendaUpdated = await service.update(tienda.id, tienda);
    expect(tiendaUpdated).toBeDefined();

    const storedTienda = await service.findOne(tienda.id);
    expect(storedTienda).toBeDefined();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.direccion).toBe(tienda.direccion);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
  });

  it('should throw an error when trying to update a non-existing store', async () => {
    const tienda = tiendasList[0];
    tienda.id = '1';
    await expect(service.update(tienda.id, tienda)).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });

  it('should throw an error when trying to update a store with invalid ciudad', async () => {
    const tienda = tiendasList[0];
    tienda.ciudad = 'INVALIDO';
    await expect(service.update(tienda.id, tienda)).rejects.toHaveProperty(
      'message',
      'La ciudad no es válida',
    );
  });

  it('should delete a store', async () => {
    const tienda = tiendasList[0];
    await service.delete(tienda.id);

    const tiendaFound = await repository.findOne({ where: { id: tienda.id } });
    expect(tiendaFound).toBeNull();
  });

  it('should throw an error when trying to delete a non-existing store', async () => {
    await expect(service.delete('1')).rejects.toHaveProperty(
      'message',
      'No existe la tienda con el id indicado',
    );
  });
});
