import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Item } from 'src/db/models/item.entity';
import { Category } from 'src/db/models/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/db/models/inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionHeader, TransactionLine, Item, Category, Inventory]),
  ],
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}