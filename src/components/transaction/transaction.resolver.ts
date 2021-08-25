import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { TransactionLineInput } from '../dto/transaction.input';
import { TransactionArgs } from '../item/dto/transaction.args';

@Resolver(() => TransactionHeader)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionHeader)
  createTransaction(@Args('input') tranHeader: CreateTransactionInput) {
    return this.transactionService.create(tranHeader);
  }

  @Mutation(() => TransactionLine)
  addTransactionLine(@Args('input') tranLine: TransactionLineInput) {
    return this.transactionService.createLine(tranLine);
  }

  @Query(() => [TransactionHeader], { name: 'transaction' })
  transactions(@Args() transactionArgs: TransactionArgs): Promise<Array<TransactionHeader>> {
    return this.transactionService.findAll(transactionArgs);
  }

  @Query(() => TransactionHeader, { name: 'transaction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.findOne(id);
  }

  @Mutation(() => TransactionHeader)
  updateTransaction(
    @Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput,
  ) {
    return this.transactionService.update(updateTransactionInput.id, updateTransactionInput);
  }

  @Mutation(() => TransactionHeader)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }
}