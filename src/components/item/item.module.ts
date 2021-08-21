import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/db/models/item.entity';
import { Category } from 'src/db/models/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category])],
  providers: [ItemResolver, ItemService],
})
export class ItemModule {}
