import { ArgsType, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';

@ArgsType()
export class ItemArgs extends PartialType(PaginationArgs) {}
