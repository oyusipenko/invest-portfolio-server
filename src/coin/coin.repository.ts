import { Repository } from 'typeorm';
import { Coin } from './coin.entity';
import { AddCoinDto, CoinDto } from './dto/add-coin.dto';

export interface CoinRepository extends Repository<Coin> {
  this: Repository<Coin>;

  getAllUserCoins(): Promise<Coin[]>;

  addCoin: any;
  deleteCoin: any;
  updateCoin: any;
}

export const customCoinRepositoryMethods: Pick<
  CoinRepository,
  'getAllUserCoins' | 'addCoin' | 'deleteCoin' | 'updateCoin'
> = {
  async getAllUserCoins(this: Repository<Coin>) {
    const allUserCoins = await this.find();

    return allUserCoins;
  },
  async addCoin(this: Repository<Coin>, addCoinDto: AddCoinDto) {
    const { coinName, quantity, price } = addCoinDto;

    const coin = await this.create({
      coinName: coinName.toUpperCase(),
      quantity,
      price,
    });

    await this.save(coin);
    return coin;
  },

  async deleteCoin(this: Repository<Coin>, id: string) {
    await this.delete(id);
  },

  async updateCoin(this: Repository<Coin>, coinDto: CoinDto) {
    await this.createQueryBuilder()
      .update(coinDto)
      .set(coinDto)
      .where('id = :id', { id: coinDto.id })
      .execute();
  },
};
