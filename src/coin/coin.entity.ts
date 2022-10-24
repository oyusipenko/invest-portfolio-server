import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coinName: string;

  @Column()
  quantity: string;

  @Column()
  price: string;
}
