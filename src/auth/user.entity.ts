import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coin } from '../coin/coin.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Coin, (coin) => coin.user, { eager: true })
  coins: Coin[];
}
