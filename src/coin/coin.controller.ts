import { Body, Controller, Delete, Get, Post } from '@nestjs/common';

import { CoinService } from './coin.service';
import { AddCoinDto, CoinDto } from './dto/add-coin.dto';

import { Coin } from './coin.entity';
import { ICoin, IResponseGetPortfolioStatus } from './coin.model';

@Controller('coins')
export class CoinController {
  constructor(private coinsService: CoinService) {}

  @Get()
  getAllUserCoins(): Promise<ICoin[]> {
    return this.coinsService.getAllUserCoins();
  }

  @Post()
  addCoin(@Body() addCoinDto: AddCoinDto): Promise<Coin> {
    return this.coinsService.addCoin(addCoinDto);
  }

  @Get('/portfolio_status')
  getPortfolioStatus(): Promise<IResponseGetPortfolioStatus> {
    return this.coinsService.getPortfolioStatus();
  }

  @Post('/delete')
  deleteCoin(@Body() id: Coin['id']): Promise<unknown> {
    return this.coinsService.deleteCoin(id);
  }

  @Post('/buy_more')
  buyMoreCoins(@Body() coinDto: CoinDto): Promise<unknown> {
    return this.coinsService.buyMoreCoins(coinDto);
  }
}
