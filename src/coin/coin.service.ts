import { Injectable } from '@nestjs/common';
import { Coin } from './coin.entity';
import { AddCoinDto } from './dto/add-coin.dto';
import { CoinRepository } from './coin.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: CoinRepository,
  ) {}

  async getAllCoins(): Promise<Coin[]> {
    return this.coinRepository.getAllCoins();
  }

  async addCoin(addCoinDto: AddCoinDto): Promise<Coin> {
    return this.coinRepository.addCoin(addCoinDto);
  }
}
