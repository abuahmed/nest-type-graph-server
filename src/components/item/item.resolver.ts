import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput } from './dto/create-item.input';
import { Item } from 'src/db/models/item.entity';
import { ItemArgs } from './dto/item.args';
import { DelResult } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Category } from 'src/db/models/category.entity';
import { DisplayInput } from '../dto/display.input';
import { CategoryInput } from '../dto/category.input';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  createItem(@Args('input') input: CreateItemInput) {
    return this.itemService.createUpdate(input);
  }

  @Mutation(() => Category)
  createItemCategory(@Args('input') input: CategoryInput) {
    return this.itemService.createItemCategory(input);
  }

  // @Mutation(() => Category)
  // createItemUom(@Args('input') input: CreateItemInput) {
  //   return this.itemService.createItemUom(input);
  // }

  @Query(() => [Item])
  items(@Args() itemArgs: ItemArgs): Promise<Array<Item>> {
    return this.itemService.findAll(itemArgs);
  }

  @Query(() => [Category])
  getItemCategories(): Promise<Array<Category>> {
    return this.itemService.getItemCategories();
  }

  @Query(() => [Category])
  getItemUoms(): Promise<Array<Category>> {
    return this.itemService.getItemUoms();
  }

  @Query(() => Item)
  getItem(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.findOne(id);
  }

  // @Mutation(() => Item)
  // updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
  //   return this.itemService.update(updateItemInput.id, updateItemInput);
  // }

  @Mutation(() => DelResult)
  removeItem(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.remove(id);
  }
  @Mutation(() => DelResult)
  removeItemCategory(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.removeItemCategory(id);
  }
  @Mutation(() => DelResult)
  removeItemUom(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.removeItemUom(id);
  }
}
