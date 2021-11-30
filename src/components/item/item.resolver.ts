import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput, FinancialAccountInput, ItemsWithCount } from './dto/create-item.input';
import { Item } from 'src/db/models/item.entity';
import { CategoryArgs, FinancialAccountArgs, ItemArgs } from './dto/item.args';
import { DelResult } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Category } from 'src/db/models/category.entity';
import { CategoryInput } from '../dto/category.input';
import { FinancialAccount } from 'src/db/models/financialAccount.entity';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  createItem(@Args('input') input: CreateItemInput) {
    return this.itemService.createUpdate(input);
  }

  @Query(() => ItemsWithCount)
  items(@Args() itemArgs: ItemArgs): Promise<ItemsWithCount> {
    return this.itemService.findAll(itemArgs);
  }

  @Query(() => [Item])
  getItems(@Args() itemArgs: ItemArgs): Promise<Array<Item>> {
    return this.itemService.getAllItems(itemArgs);
  }

  @Query(() => Item)
  getItem(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.findOne(id);
  }

  @Mutation(() => FinancialAccount)
  createFinancialAccount(@Args('input') input: FinancialAccountInput) {
    return this.itemService.createUpdateFinancialAccount(input);
  }

  @Query(() => [FinancialAccount])
  financialAccounts(@Args() faArgs: FinancialAccountArgs): Promise<Array<FinancialAccount>> {
    return this.itemService.findAllFinancialAccounts(faArgs);
  }

  @Query(() => FinancialAccount)
  getFinancialAccount(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.findOneFinancialAccount(id);
  }

  @Query(() => [Category])
  getCategories(@Args() categoryArgs: CategoryArgs): Promise<Array<Category>> {
    return this.itemService.getCategories(categoryArgs);
  }

  @Mutation(() => Category)
  createItemCategory(@Args('input') input: CategoryInput) {
    return this.itemService.createItemCategory(input);
  }

  @Mutation(() => DelResult)
  removeItem(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.remove(id);
  }
  @Mutation(() => DelResult)
  removeFinancialAccount(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.removeFinancialAccount(id);
  }
  @Mutation(() => DelResult)
  removeCategory(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.removeCategory(id);
  }
}
