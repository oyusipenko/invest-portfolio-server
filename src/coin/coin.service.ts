import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';

import { Coin } from './coin.entity';
import { AddCoinDto } from './dto/add-coin.dto';
import { CoinRepository } from './coin.repository';
import {
  IAllCoinsStatus,
  ICoin,
  IPerCoinStatus,
  IResponseGetPortfolioStatus,
} from './coin.model';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: CoinRepository,
    private readonly httpService: HttpService,
  ) {}

  async getAllUserCoins(): Promise<ICoin[]> {
    return this.coinRepository.getAllUserCoins();
  }

  async addCoin(addCoinDto: AddCoinDto): Promise<Coin> {
    return this.coinRepository.addCoin(addCoinDto);
  }

  async deleteCoin(id: Coin['id']): Promise<Coin> {
    return this.coinRepository.deleteCoin(id);
  }

  async getCoinPrice(coinSymbol: string): Promise<any> {
    const { data } = await this.httpService
      .get(
        `https://www.binance.com/api/v3/ticker/price?symbol=${coinSymbol}BUSD`,
      )
      .toPromise();
    return data;
  }

  async getPortfolioStatus(): Promise<IResponseGetPortfolioStatus> {
    const allUserCoins = await this.getAllUserCoins();

    const coinsCurrentPrice = await Promise.all(
      allUserCoins.map((coin) => this.getCoinPrice(coin.coinName)),
    ).then((res) =>
      res.reduce((acc, coin) => {
        const coinName = coin.symbol.substring(0, coin.symbol.indexOf('BUSD'));
        const coinPrice = coin.price;
        return { ...acc, [coinName]: coinPrice };
      }, {}),
    );

    const statusPerCoin: IPerCoinStatus[] = allUserCoins.reduce(
      (acc: IPerCoinStatus[], coin: ICoin) => {
        const coinStatus = {
          quantity: +coin.quantity,
          coinName: coin.coinName,
          priceStartAverage: +coin.priceAverage,
          costStart: +coin.quantity * +coin.priceAverage,
          priceCurrent: +coinsCurrentPrice[coin.coinName],
          costCurrent: +coin.quantity * +coinsCurrentPrice[coin.coinName],
          profitDollar:
            +coin.quantity * +coinsCurrentPrice[coin.coinName] -
            +coin.quantity * +coin.priceAverage,
          profitPercent:
            ((+coin.quantity * +coinsCurrentPrice[coin.coinName] -
              +coin.quantity * +coin.priceAverage) /
              (+coin.quantity * +coin.priceAverage)) *
            100,
        };
        const test = [...acc, coinStatus];
        return test;
      },
      [],
    );

    const statusAllCoins: IAllCoinsStatus = statusPerCoin.reduce(
      (acc, coin) => {
        const costStart: number = +acc.costStart + +coin.costStart;
        const costCurrent: number = +acc.costCurrent + +coin.costCurrent;
        const profitUsd: number = costCurrent - costStart;
        const profitPercentage: number = (profitUsd / costStart) * 100;
        return { ...acc, costStart, costCurrent, profitUsd, profitPercentage };
      },
      { costStart: 0, costCurrent: 0, profitUsd: 0, profitPercentage: 0 },
    );

    const portfolioStatus: IResponseGetPortfolioStatus = {
      perCoin: [...statusPerCoin],
      allCoins: {
        ...statusAllCoins,
      },
    };
    return portfolioStatus;
  }
}
