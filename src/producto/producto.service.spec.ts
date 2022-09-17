import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productsList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductoEntity = await repository.save({
        nombre: `Producto ${i}`,
        precio: faker.random.numeric(4),
        tipo: 'Perecedero',
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    const products: ProductoEntity[] = await service.findAll();
    expect(products).toBeDefined();
    expect(products.length).toBe(productsList.length);
  });

  it('should return one product', async () => {
    const product: ProductoEntity = await service.findOne(productsList[0].id);
    expect(product).toBeDefined();
    expect(product.nombre).toBe(productsList[0].nombre);
    expect(product.precio).toBe(productsList[0].precio);
    expect(product.tipo).toBe(productsList[0].tipo);
  });

  it('should throw an error when trying to find a non-existing product', async () => {
    await expect(() => service.findOne('1')).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('should create a product', async () => {
    const product: ProductoEntity = await service.create({
      id: '',
      nombre: faker.random.word(),
      precio: faker.random.numeric(4),
      tipo: 'Perecedero',
      tiendas: [],
    });
    expect(product).toBeDefined();

    const productFound: ProductoEntity = await service.findOne(product.id);
    expect(productFound).toBeDefined();
  });

  it('should throw an error when trying to create a product with invalid tipo', async () => {
    await expect(() =>
      service.create({
        id: '',
        nombre: faker.random.word(),
        precio: faker.random.numeric(4),
        tipo: 'INVALIDO',
        tiendas: [],
      }),
    ).rejects.toHaveProperty('message', 'El tipo de producto no es válido');
  });

  it('should update a product', async () => {
    const product = productsList[0];
    product.nombre = faker.random.word();
    product.precio = faker.random.numeric(4);
    const updatedProduct = await service.update(product.id, product);
    expect(updatedProduct).toBeDefined();
    const storedProduct = await service.findOne(product.id);
    expect(storedProduct).toBeDefined();
    expect(storedProduct.nombre).toBe(product.nombre);
  });

  it('should throw an error when trying to update a non-existing product', async () => {
    await expect(() =>
      service.update('1', {
        id: '',
        nombre: faker.random.word(),
        precio: faker.random.numeric(4),
        tipo: 'Perecedero',
        tiendas: [],
      }),
    ).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });

  it('should throw an error when trying to update a product with invalid tipo', async () => {
    const product = productsList[0];
    product.nombre = faker.random.word();
    product.precio = faker.random.numeric(4);
    product.tipo = 'INVALIDO';
    await expect(() =>
      service.update(product.id, product),
    ).rejects.toHaveProperty('message', 'El tipo de producto no es válido');
  });

  it('should delete a product', async () => {
    const product = productsList[0];
    await service.delete(product.id);

    const productFound = await repository.findOne({
      where: { id: product.id },
    });
    expect(productFound).toBeNull();
  });

  it('should throw an error when trying to delete a non-existing product', async () => {
    await expect(() => service.delete('1')).rejects.toHaveProperty(
      'message',
      'No existe el producto con el id indicado',
    );
  });
});
