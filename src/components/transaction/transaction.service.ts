import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Repository } from 'typeorm';
import { TransactionLineInput } from '../dto/transaction.input';
import { TransactionArgs } from '../item/dto/transaction.args';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionHeader)
    private readonly transactionHeaderRepository: Repository<TransactionHeader>,
    @InjectRepository(TransactionLine)
    private readonly transactionLineRepository: Repository<TransactionLine>,
  ) {}

  async create(tranHeader: CreateTransactionInput) {
    //const { lines } = transactionInput;
    try {
      const transaction = tranHeader.id
        ? await this.transactionHeaderRepository.preload(tranHeader)
        : this.transactionHeaderRepository.create(tranHeader);

      const response = await this.transactionHeaderRepository.save(transaction);

      return response;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
  async createLine(tranLine: TransactionLineInput) {
    const { header } = tranLine;
    try {
      const line = tranLine.id
        ? await this.transactionLineRepository.preload(tranLine)
        : this.transactionLineRepository.create(tranLine);

      if (header) {
        line.header = this.transactionHeaderRepository.create(header);
      }
      const response = await this.transactionLineRepository.save(line);

      return response;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findAll(transactionArgs: TransactionArgs): Promise<TransactionHeader[]> {
    const { skip, take } = transactionArgs;

    const transactionsQB = this.transactionHeaderRepository.createQueryBuilder('t');
    // if (transactionCategoryId) {
    //   transactionsQB = transactionsQB.andWhere('i.transactionCategoryID = :transactionCategoryId', { transactionCategoryId });
    // }
    // if (unitOfMeasureId) {
    //   transactionsQB = transactionsQB.andWhere('i.unitOfMeasureId = :unitOfMeasureId', { unitOfMeasureId });
    // }
    return await transactionsQB.take(take).skip(skip).cache(true).getMany();
  }

  async findOne(id: number) {
    return await this.transactionHeaderRepository.findOne({ id }, { relations: ['lines'] });
  }

  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
