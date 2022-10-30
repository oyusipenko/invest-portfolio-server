import { Repository } from 'typeorm';
import { Coin } from './coin.entity';
import { AddCoinDto } from './dto/add-coin.dto';
import { ICoin } from './coin.model';
import { User } from '../auth/user.entity';

export interface CoinRepository extends Repository<Coin> {
  this: Repository<Coin>;

  getAllUserCoins(arg0: User): Promise<Coin[]>;

  addCoin: (arg0: AddCoinDto, arg1: User) => Promise<Coin>;
  deleteCoin: (arg0: Coin['id'], arg1: User) => Promise<void>;
  updateCoin: (arg0: Partial<ICoin>) => Promise<void>;
}

export const customCoinRepositoryMethods: Pick<
  CoinRepository,
  'getAllUserCoins' | 'addCoin' | 'deleteCoin' | 'updateCoin'
> = {
  async getAllUserCoins(user) {
    const query = this.createQueryBuilder('coin');
    query.where({ user });
    const allUserCoins = query.getMany();
    return allUserCoins;
  },
  async addCoin(addCoinDto, user) {
    const { coinName, quantity, priceAverage } = addCoinDto;
    const coin = await this.create({
      coinName: coinName.toUpperCase(),
      quantity,
      priceAverage,
      user,
    });

    await this.save(coin);
    return coin;
  },

  async deleteCoin(id: string, user) {
    await this.delete(id, user);
  },

  async updateCoin(coin: Partial<ICoin>) {
    await this.createQueryBuilder()
      .update(coin)
      .set(coin)
      .where('id = :id', { id: coin.id })
      .execute();
  },
};
