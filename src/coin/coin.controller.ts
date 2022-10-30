import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CoinService } from './coin.service';
import { AddCoinDto, CoinDto } from './dto/add-coin.dto';

import { Coin } from './coin.entity';
import { ICoin, IPortfolioStatus } from './coin.model';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('coins')
@UseGuards(AuthGuard())
export class CoinController {
  constructor(private coinsService: CoinService) {}

  @Get('/all')
  getAllCoins(@GetUser() user: User): Promise<ICoin[]> {
    return this.coinsService.getAllUserCoins(user);
  }

  @Post('/add')
  addCoin(
    @Body() addCoinDto: AddCoinDto,
    @GetUser() user: User,
  ): Promise<Coin> {
    return this.coinsService.addCoin(addCoinDto, user);
  }

  @Get('/portfolio_status')
  getPortfolioStatus(@GetUser() user: User): Promise<IPortfolioStatus | null> {
    return this.coinsService.getPortfolioStatus(user);
  }

  @Post('/delete')
  deleteCoin(@Body() id: Coin['id'], @GetUser() user: User): Promise<void> {
    return this.coinsService.deleteCoin(id, user);
  }

  @Post('/buy_more')
  buyMoreCoins(
    @Body() coinDto: CoinDto,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.coinsService.buyMoreCoins(coinDto, user);
  }

  @Post('/sell')
  sellCoins(
    @Body() data: Pick<ICoin, 'id' | 'quantity'>,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.coinsService.sellCoins(data, user);
  }

  @Post('/edit')
  editCoins(@Body() data: Partial<ICoin>): Promise<unknown> {
    return this.coinsService.editCoins(data);
  }
}
