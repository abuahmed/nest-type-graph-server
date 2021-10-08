import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Client } from 'src/db/models/client.entity';
import { Organization } from 'src/db/models/organization.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientInput, OrganizationInput, WarehouseInput } from './dto/create-update.input';
import { ClientArgs, OrganizationArgs, WarehouseArgs } from './dto/list.args';
import { WarehouseService } from './warehouse.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class WarehouseResolver {
  constructor(private readonly _warehouseService: WarehouseService) {}

  //Warehouse
  @Query(() => [Warehouse])
  async warehouses(@Args() warehouseArgs: WarehouseArgs): Promise<Array<Warehouse>> {
    return this._warehouseService.findAllWarehouses(warehouseArgs);
  }

  @Query(() => Warehouse)
  async getWarehouse(@Args('id', { type: () => Int }) id: number): Promise<Warehouse> {
    return this._warehouseService.findOneWarehouse(id);
  }

  @Mutation(() => Warehouse)
  async createUpdateWarehouse(@Args('input') input: WarehouseInput) {
    return this._warehouseService.createUpdateWarehouse(input);
  }

  //Organization
  @Query(() => [Organization])
  async organizations(@Args() organizationArgs: OrganizationArgs): Promise<Array<Organization>> {
    return this._warehouseService.findAllOrganizations(organizationArgs);
  }

  @Query(() => Organization)
  async getOrganization(@Args('id', { type: () => Int }) id: number): Promise<Organization> {
    return this._warehouseService.findOneOrganization(id);
  }

  @Mutation(() => Organization)
  async createUpdateOrganization(@Args('input') input: OrganizationInput) {
    return this._warehouseService.createUpdateOrganization(input);
  }

  //Client
  @Query(() => [Client])
  async clients(@Args() clientArgs: ClientArgs): Promise<Array<Client>> {
    return this._warehouseService.findAllClients(clientArgs);
  }

  @Query(() => Client)
  async getClient(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    return this._warehouseService.findOneClient(id);
  }

  @Mutation(() => Client)
  async createUpdateClient(@Args('input') input: ClientInput) {
    return this._warehouseService.createUpdateClient(input);
  }
}
