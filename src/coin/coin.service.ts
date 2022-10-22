import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Coin } from './coin.entity';
import { AddCoinDto } from './dto/add-coin.dto';
import { CoinRepository } from './coin.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IPortfolioStatus } from './coin.model';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: CoinRepository,
    private readonly httpService: HttpService,
  ) {}

  async getAllUserCoins(): Promise<Coin[]> {
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

  async getPortfolioStatus(): Promise<unknown> {
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

    const statusPerCoin = allUserCoins.reduce((acc, coin) => {
      const coinStatus = {
        quantity: coin.quantity,
        coinName: coin.coinName,
        priceAverage: Number(coin.priceAverage).toFixed(2),
        startCost: (+coin.quantity * +coin.priceAverage).toFixed(2),
        currentPrice: Number(coinsCurrentPrice[coin.coinName]).toFixed(2),
        currentCost: (
          +coin.quantity * +coinsCurrentPrice[coin.coinName]
        ).toFixed(2),
        profitDollar: (
          +coin.quantity * +coinsCurrentPrice[coin.coinName] -
          +coin.quantity * +coin.priceAverage
        ).toFixed(2),
        profitPercent: (
          ((+coin.quantity * +coinsCurrentPrice[coin.coinName] -
            +coin.quantity * +coin.priceAverage) /
            (+coin.quantity * +coin.priceAverage)) *
          100
        ).toFixed(0),
      };
      const test = [...acc, coinStatus];
      return test;
    }, []);

    const statusAllCoins = statusPerCoin.reduce(
      (acc, coin) => {
        const startCost: number = +acc.startCost + +coin.startCost;
        const currentCost: number = +acc.currentCost + +coin.currentCost;
        const profitUsd: number = +(currentCost - startCost).toFixed(2);
        const profitPercentage: number = +(
          (profitUsd / startCost) *
          100
        ).toFixed(2);
        return { ...acc, startCost, currentCost, profitUsd, profitPercentage };
      },
      { startCost: 0, currentCost: 0, profitUsd: 0, profitPercentage: 0 },
    );

    const portfolioStatus = {
      perCoin: [...statusPerCoin],
      allCoins: {
        ...statusAllCoins,
      },
    };
    return portfolioStatus;
  }
}
