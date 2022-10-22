import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { customCoinRepositoryMethods } from './coin.repository';
import { Coin } from './coin.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Coin])],
  controllers: [CoinController],
  providers: [
    {
      provide: getRepositoryToken(Coin),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(Coin)
          .extend(customCoinRepositoryMethods);
      },
    },
    CoinService,
  ],
})
export class CoinModule {}
