import { IsNotEmpty } from 'class-validator';

export class AddCoinDto {
  @IsNotEmpty()
  coinName: string;
  quantity: string;
  price: string;
}

export class CoinDto {
  @IsNotEmpty()
  id: string;
  coinName: string;
  quantity: string;
  price: string;
}
