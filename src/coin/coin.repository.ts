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

  getAllUserCoins(): Promise<Coin[]>;

  addCoin: any;
  deleteCoin: any;
}

export const customCoinRepositoryMethods: Pick<
  CoinRepository,
  'getAllUserCoins' | 'addCoin' | 'deleteCoin'
> = {
  async getAllUserCoins(this: Repository<Coin>) {
    const allUserCoins = await this.find();

    return allUserCoins;
  },
  async addCoin(this: Repository<Coin>, addCoinDto: AddCoinDto) {
    const { coinName, quantity, priceAverage } = addCoinDto;

    const coin = this.create({
      coinName: coinName.toUpperCase(),
      quantity,
      priceAverage,
    });

    await this.save(coin);
    return coin;
  },

  async deleteCoin(this: Repository<Coin>, id: string) {
    await this.delete(id);
  },
};
