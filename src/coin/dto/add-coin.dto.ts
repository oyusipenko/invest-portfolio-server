import { IsNotEmpty } from 'class-validator';

export class AddCoinDto {
  @IsNotEmpty()
  coinName: string;
  quantity: string;
  priceAverage: string;
}

export class CoinDto {
  @IsNotEmpty()
  id: string;
  coinName: string;
  quantity: string;
  priceAverage: string;
}
