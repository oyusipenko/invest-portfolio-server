import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';

import { Coin } from './coin.entity';
import { AddCoinDto, CoinDto } from './dto/add-coin.dto';
import { CoinRepository } from './coin.repository';
import {
  IAllCoinsStatus,
  ICoin,
  IPerCoinStatus,
  IPortfolioStatus,
} from './coin.model';
import { User } from '../auth/user.entity';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: CoinRepository,
    private readonly httpService: HttpService,
  ) {}

  async getAllUserCoins(user: User): Promise<Coin[]> {
    return await this.coinRepository.getAllUserCoins(user);
  }

  async addCoin(addCoinDto: AddCoinDto, user: User): Promise<Coin> {
    try {
      await this.httpService
        .get(
          `https://www.binance.com/api/v3/ticker/price?symbol=${addCoinDto.coinName}BUSD`,
        )
        .toPromise();

      return await this.coinRepository.addCoin(addCoinDto, user);
    } catch (e) {
      throw new NotFoundException(
        `Coin "${addCoinDto.coinName}" doesn\'t exists in Binance market!`,
      );
    }
  }

  async deleteCoin(id: Coin['id'], user: User): Promise<void> {
    return await this.coinRepository.deleteCoin(id, user);
  }

  async getCoinPrice(coinSymbol: string): Promise<any> {
    const { data } = await this.httpService
      .get(
        `https://www.binance.com/api/v3/ticker/price?symbol=${coinSymbol}BUSD`,
      )
      .toPromise();
    return data;
  }

  async getPortfolioStatus(user: User): Promise<IPortfolioStatus> {
    let portfolioStatus: IPortfolioStatus = {
      perCoin: null,
      allCoins: null,
    };

    const allUserCoins = await this.getAllUserCoins(user);

    if (!allUserCoins.length) {
      return portfolioStatus;
    }

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
        const arr = [...acc, coinStatus];
        return arr;
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

    portfolioStatus = {
      perCoin: [...statusPerCoin],
      allCoins: {
        ...statusAllCoins,
      },
    };

    return portfolioStatus;
  }

  async buyMoreCoins(coinDto: CoinDto, user: User): Promise<void> {
    const allUserCoins = await this.getAllUserCoins(user);
    const selectedCoin = allUserCoins.find((coin) => coin.id === coinDto.id);

    const updatedCoinData = {
      id: coinDto.id,
      quantity: (+selectedCoin.quantity + +coinDto.quantity).toString(),
      priceAverage: (
        (+coinDto.quantity * +coinDto.priceAverage +
          +selectedCoin.quantity * +selectedCoin.priceAverage) /
        (+coinDto.quantity + +selectedCoin.quantity)
      ).toString(),
    };

    await this.coinRepository.updateCoin(updatedCoinData);
  }

  async sellCoins(
    data: Pick<ICoin, 'id' | 'quantity'>,
    user: User,
  ): Promise<void> {
    const allUserCoins = await this.getAllUserCoins(user);
    const selectedCoin = allUserCoins.find((coin) => coin.id === data.id);

    const updatedCoinData = {
      id: data.id,
      quantity: (+selectedCoin.quantity - +data.quantity).toString(),
    };

    await this.coinRepository.updateCoin(updatedCoinData);
  }

  async editCoins(data: Partial<ICoin>): Promise<void> {
    await this.coinRepository.updateCoin(data);
  }
}
