export interface ICoin {
  id?: string;
  coinName: string;
  quantity: string;
  price: string;
}

export interface IAllCoinsStatus {
  costStart: number;
  costCurrent: number;
  profitUsd: number;
  profitPercentage: number;
}

export interface IPerCoinStatus {
  coinName: string;
  quantity: number;
  costStart: number;
  priceStartAverage: number;
  priceCurrent: number;
  costCurrent: number;
  profitDollar: number;
  profitPercent: number;
}

export interface IPortfolioStatus {
  perCoin: IPerCoinStatus[] | null;
  allCoins: IAllCoinsStatus | null;
}
