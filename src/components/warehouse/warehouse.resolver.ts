import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Item } from 'src/db/models/item.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { DisplayInput } from '../user/dto/user.dto';
import { WarehouseService } from './warehouse.service';

@Resolver()
export class WarehouseResolver {
  constructor(private readonly _warehouseService: WarehouseService) {}

  //Query
  @Query(() => [Warehouse])
  async Warehouses(): Promise<Array<Warehouse>> {
    return this._warehouseService.findAll();
  }

  @Mutation(() => Warehouse)
  async create(@Args('input') input: DisplayInput) {
    return this._warehouseService.create(input);
  }

  @Mutation(() => Item)
  async createItem(@Args('input') input: Item) {
    return this._warehouseService.createItem(input);
  }
}
