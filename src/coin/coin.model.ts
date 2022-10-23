export interface ICoin {
  coinName: string;
  quantity: string;
  priceAverage: string;
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

export interface IResponseGetPortfolioStatus {
  perCoin: IPerCoinStatus[];
  allCoins: IAllCoinsStatus;
}
