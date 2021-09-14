import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Repository } from 'typeorm';
import { TransactionLineInput } from '../dto/transaction.input';
import { LineArgs, TransactionArgs } from './dto/transaction.args';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { startOfDay, endOfDay } from 'date-fns';
import { PaginationArgs } from '../dto/pagination.args';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionHeader)
    private readonly headerRepo: Repository<TransactionHeader>,
    @InjectRepository(TransactionLine)
    private readonly lineRepo: Repository<TransactionLine>,
  ) {}

  async create(header: CreateTransactionInput) {
    //const { lines } = transactionInput;
    try {
      const transaction = header.id
        ? await this.headerRepo.preload(header)
        : this.headerRepo.create(header);

      const response = await this.headerRepo.save(transaction);

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
  async createLine(tranLine: TransactionLineInput): Promise<TransactionHeader> {
    const { header } = tranLine;
    try {
      const line = tranLine.id
        ? await this.lineRepo.preload(tranLine)
        : this.lineRepo.create(tranLine);

      const transaction = header.id
        ? await this.headerRepo.preload(header)
        : this.headerRepo.create(header);

      transaction.totalAmount = transaction.totalAmount
        ? transaction.totalAmount + line.eachPrice
        : line.eachPrice;
      transaction.totalQty = transaction.totalQty ? transaction.totalQty + line.qty : line.qty;
      transaction.numberOfItems = transaction.numberOfItems ? transaction.numberOfItems + 1 : 1;

      line.header = transaction;

      const response = await this.lineRepo.save(line);

      return response.header;
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
    const {
      type,
      warehouseId,
      businessPartnerId,
      durationBegin: startDate,
      durationEnd: endDate,
      skip,
      take,
    } = transactionArgs;
    let transactionsQB = this.headerRepo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.warehouse', 'Warehouse')
      .innerJoinAndSelect('t.businessPartner', 'BusinessPartner')
      .where('t.type = :type', {
        type: type,
      });

    if (warehouseId) {
      transactionsQB = transactionsQB.andWhere('t.warehouseId = :warehouseId', {
        warehouseId,
      });
    }
    if (businessPartnerId) {
      transactionsQB = transactionsQB.andWhere('t.businessPartnerId = :businessPartnerId', {
        businessPartnerId,
      });
    }
    if (startDate && endDate) {
      transactionsQB = transactionsQB.andWhere(
        't.transactionDate BETWEEN :startDate AND :endDate',
        {
          startDate: startOfDay(startDate).toISOString(),
          endDate: endOfDay(endDate).toISOString(),
        },
      );
    }
    return await transactionsQB.take(take).skip(skip).getMany();
  }

  async findLines(lineArgs: LineArgs): Promise<TransactionLine[]> {
    const { headerId, skip, take } = lineArgs;
    const linesQB = this.lineRepo
      .createQueryBuilder('l')
      .innerJoinAndSelect('l.item', 'Item')
      .where('l.headerId = :headerId', {
        headerId: headerId,
      });

    return await linesQB.take(take).skip(skip).getMany();
  }

  async findOne(id: number) {
    try {
      return await this.headerRepo.findOne(
        { id },
        {
          relations: ['lines', 'lines.item', 'lines.item.itemCategory', 'lines.item.unitOfMeasure'],
        },
      );
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

  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
