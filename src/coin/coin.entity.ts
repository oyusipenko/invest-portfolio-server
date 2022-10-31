import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  coinName: string;

  @Column()
  quantity: string;

  @Column()
  priceAverage: string;

  @ManyToOne((_type) => User, (user) => user.coins, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
