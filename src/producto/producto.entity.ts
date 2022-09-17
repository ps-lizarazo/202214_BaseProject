import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;
}
