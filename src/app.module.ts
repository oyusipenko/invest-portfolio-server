import { Module } from '@nestjs/common';
import { CoinsModule } from './coins/coins.module';
@Module({
  imports: [CoinsModule],
})
export class AppModule {}
