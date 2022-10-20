import { Repository } from 'typeorm';
import { Coin } from './coin.entity';
import { AddCoinDto } from './dto/add-coin.dto';
/*

export class CoinRepository extends Repository<Coin> {
  async getAllCoins(): Promise<Coin[]> {
    return this.query(`SELECT * FROM COIN`);
  }

  async addCoin(addCoinDto: AddCoinDto): Promise<Coin> {
    const { coinName, quantity, price } = addCoinDto;

    const coin = this.create({ coinName, quantity, price });

    await this.save(coin);
    return coin;
  }
}
*/

export interface CoinRepository extends Repository<Coin> {
  this: Repository<Coin>;

  getAllCoins(): Promise<Coin[]>;

  addCoin: any;
}

export const customCoinRepositoryMethods: Pick<
  CoinRepository,
  'getAllCoins' | 'addCoin'
> = {
  getAllCoins(this: Repository<Coin>) {
    return this.find();
  },
  async addCoin(this: Repository<Coin>, addCoinDto: AddCoinDto) {
    const { coinName, quantity, price } = addCoinDto;

    const coin = this.create({ coinName, quantity, price });
    console.log('coin', coin);
    await this.save(coin);
    return coin;
  },
};
