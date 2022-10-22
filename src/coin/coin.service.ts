import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Coin } from './coin.entity';
import { AddCoinDto } from './dto/add-coin.dto';
import { CoinRepository } from './coin.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IPortfolioStatus } from './coin.model';
import { map, catchError, Observable } from 'rxjs';
import axios from '@nestjs/axios';

class AxiosResponse<T> {}

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: CoinRepository,
    private readonly httpService: HttpService,
  ) {}

  async getAllCoins(): Promise<Coin[]> {
    return this.coinRepository.getAllCoins();
  }

  async addCoin(addCoinDto: AddCoinDto): Promise<Coin> {
    return this.coinRepository.addCoin(addCoinDto);
  }

  async deleteCoin(id: Coin['id']): Promise<Coin> {
    return this.coinRepository.deleteCoin(id);
  }

  async getCoinPrice(coinSymbol: string): Promise<any> {
    console.log(
      `https://www.binance.com/api/v3/ticker/price?symbol=${coinSymbol}BUSD`,
    );
    const { data } = await this.httpService
      .get(
        `https://www.binance.com/api/v3/ticker/price?symbol=${coinSymbol}BUSD`,
      )
      .toPromise();
    return data;
  }

  async getPortfolioStatus(): Promise<IPortfolioStatus> {
    const coins = await this.getAllCoins();
    console.log('coins', coins);
    // const response = coins.map((coin) => coin.coinName);
    const response = await Promise.all(
      coins.map((coin) => this.getCoinPrice(coin.coinName)),
    ).then((res) =>
      res.map((coinPrice) => {
        const coinName = coinPrice.symbol.substring(
          0,
          coinPrice.symbol.indexOf('BUSD'),
        );
        return {
          [coinName]: coinPrice.price,
        };
      }),
    );
    console.log('response', response);

    const PortfolioStatus = {
      startCost: '100$',
      currentCost: '50%',
      profitUsd: '-50$',
      profitPercentage: '-50%',
    };
    return PortfolioStatus;
  }
}
