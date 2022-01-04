import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/db/models/item.entity';
import { Category } from 'src/db/models/category.entity';
import { FinancialAccount } from 'src/db/models/financialAccount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, FinancialAccount])],
  providers: [ItemResolver, ItemService],
})
export class ItemModule {}
