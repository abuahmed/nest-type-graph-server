import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { Item } from 'src/db/models/item.entity';
import { ItemArgs } from './dto/item.args';
import { DelResult } from '../user/dto/user.dto';

@Resolver(() => Item)
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
