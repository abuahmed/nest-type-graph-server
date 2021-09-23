import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { TransactionLineInput } from '../dto/transaction.input';
import { InventoryArgs, LineArgs, TransactionArgs } from './dto/transaction.args';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { DelResult } from '../user/dto/user.dto';
import { Inventory } from 'src/db/models/inventory.entity';
import { Setting } from 'src/db/models/setting';

@Resolver(() => TransactionHeader)
@UseGuards(JwtAuthGuard)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionHeader)
  createTransaction(@Args('input') tranHeader: CreateTransactionInput) {
    return this.transactionService.create(tranHeader);
  }

  @Mutation(() => TransactionLine)
  createUpdateLine(@Args('input') input: TransactionLineInput) {
    return this.transactionService.createLine(input);
  }

  @Query(() => [TransactionHeader])
  transactions(@Args() transactionArgs: TransactionArgs): Promise<Array<TransactionHeader>> {
    return this.transactionService.findAll(transactionArgs);
  }

  @Query(() => [Inventory])
  inventories(@Args() transactionArgs: InventoryArgs): Promise<Array<Inventory>> {
    return this.transactionService.findInventories(transactionArgs);
  }

  @Query(() => [TransactionLine])
  lines(@Args() transactionArgs: LineArgs): Promise<Array<TransactionLine>> {
    return this.transactionService.findLines(transactionArgs);
  }

  @Query(() => TransactionHeader)
  getHeaderById(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.findOne(id);
  }

  @Query(() => Inventory)
  getItemInventory(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.getItemInventory(id);
  }

  // @Mutation(() => TransactionHeader)
  // updateTransaction(
  //   @Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput,
  // ) {
  //   return this.transactionService.update(updateTransactionInput.id, updateTransactionInput);
  // }

  @Mutation(() => TransactionHeader)
  postHeader(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.postHeader(id);
  }
  @Mutation(() => TransactionHeader)
  unPostHeader(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.unPostHeader(id);
  }

  @Mutation(() => DelResult)
  removeHeader(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.removeHeader(id);
  }
  @Mutation(() => TransactionHeader)
  removeLine(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.removeLine(id);
  }

  @Query(() => Setting)
  getSetting(): Promise<Setting> {
    return this.transactionService.getSetting();
  }
}
