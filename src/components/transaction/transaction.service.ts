import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Repository } from 'typeorm';
import { TransactionLineInput } from '../dto/transaction.input';
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

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
