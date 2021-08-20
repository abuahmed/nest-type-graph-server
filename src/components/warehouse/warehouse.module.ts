import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/db/models/address.entity';
import { Category } from 'src/db/models/category.entity';
import { Client } from 'src/db/models/client.entity';
import { Inventory } from 'src/db/models/inventory.entity';
import { Item } from 'src/db/models/item.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { WarehouseResolver } from './warehouse.resolver';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, Organization, Client, Address, Item, Category, Inventory]),
  ],
  providers: [WarehouseResolver, WarehouseService],
})
export class WarehouseModule {}
