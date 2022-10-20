import { Body, Controller, Get, Post } from '@nestjs/common';

import { CoinService } from './coin.service';
import { AddCoinDto } from './dto/add-coin.dto';

import { Coin } from './coin.entity';

@Controller('coins')
export class CoinController {
  constructor(private coinsService: CoinService) {}

  @Get()
  getAllCoins(): Promise<any[]> {
    return this.coinsService.getAllCoins();
  }

  @Post()
  addCoin(@Body() addCoinDto: AddCoinDto): Promise<Coin> {
    return this.coinsService.addCoin(addCoinDto);
  }
}
