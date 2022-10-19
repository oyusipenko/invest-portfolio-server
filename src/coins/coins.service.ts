import { Injectable } from '@nestjs/common';
import { ICoin } from './coin.model';

@Injectable()
export class CoinsService {
  constructor() {}

  async getAllCoins(): Promise<ICoin[]> {
    return [
      { coinName: 'BTC', quantity: '0,32', price: '22029' },
      { coinName: 'ETH', quantity: '122', price: '800' },
    ];
  }
}
