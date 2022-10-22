import { Body, Controller, Delete, Get, Post } from '@nestjs/common';

import { CoinService } from './coin.service';
import { AddCoinDto } from './dto/add-coin.dto';

import { Coin } from './coin.entity';
import { IPortfolioStatus } from './coin.model';

@Controller('coins')
export class CoinController {
  constructor(private coinsService: CoinService) {}

  @Get()
  getAllUserCoins(): Promise<unknown[]> {
    return this.coinsService.getAllUserCoins();
  }

  @Post()
  addCoin(@Body() addCoinDto: AddCoinDto): Promise<Coin> {
    return this.coinsService.addCoin(addCoinDto);
  }

  @Get('/portfolio_status')
  getPortfolioStatus(): Promise<unknown> {
    return this.coinsService.getPortfolioStatus();
  }

  @Delete()
  deleteCoin(@Body() id: Coin['id']): Promise<any> {
    return this.coinsService.deleteCoin(id);
  }
}
