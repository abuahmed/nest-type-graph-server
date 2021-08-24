import { InputType, PartialType } from '@nestjs/graphql';
import { TransactionInput } from 'src/components/dto/transaction.input';

@InputType()
export class CreateTransactionInput extends PartialType(TransactionInput) {}
