import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DisplayInput } from '../dto/display.input';
import { WarehouseService } from './warehouse.service';

@Resolver()
@UseGuards(JwtAuthGuard)
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
}
