import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput } from './dto/create-item.input';
import { Item } from 'src/db/models/item.entity';
import { ItemArgs } from './dto/item.args';
import { DelResult } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Mutation(() => Item)
  createItem(@Args('input') createItemInput: CreateItemInput) {
    return this.itemService.createUpdate(createItemInput);
  }

  @Query(() => [Item])
  items(@Args() itemArgs: ItemArgs): Promise<Array<Item>> {
    return this.itemService.findAll(itemArgs);
  }

  @Query(() => Item, { name: 'item' })
  findOne(@Args('id', { type: () => Int }) id: number) {
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
}
