import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Repository } from 'typeorm';
import { TransactionLineInput } from '../dto/transaction.input';
import { LineArgs, TransactionArgs } from './dto/transaction.args';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { startOfDay, endOfDay } from 'date-fns';
import { DelResult } from '../user/dto/user.dto';
import { TransactionStatus } from 'src/db/enums/transactionStatus';
import { Inventory } from 'src/db/models/inventory.entity';
import { TransactionType } from 'src/db/enums/transactionType';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionHeader)
    private readonly headerRepo: Repository<TransactionHeader>,
    @InjectRepository(TransactionLine)
    private readonly lineRepo: Repository<TransactionLine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
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
  async createLine(tranLine: TransactionLineInput): Promise<TransactionLine> {
    const { header } = tranLine;
    try {
      const prevLine = tranLine.id ? await this.lineRepo.findOne({ id: tranLine.id }) : null;
      const line = tranLine.id
        ? await this.lineRepo.preload(tranLine)
        : this.lineRepo.create(tranLine);

      const transaction = header.id
        ? await this.headerRepo.preload(header)
        : this.headerRepo.create(header);

      transaction.totalAmount = transaction.totalAmount
        ? transaction.totalAmount + line.eachPrice * line.qty
        : line.eachPrice * line.qty;

      transaction.totalQty = transaction.totalQty ? transaction.totalQty + line.qty : line.qty;
      transaction.numberOfItems = transaction.numberOfItems ? transaction.numberOfItems + 1 : 1;
      if (prevLine) {
        transaction.totalAmount = transaction.totalAmount - prevLine.eachPrice * prevLine.qty;
        transaction.totalQty = transaction.totalQty - prevLine.qty;
        transaction.numberOfItems = transaction.numberOfItems - 1;
      }

      line.header = transaction;

      const response = await this.lineRepo.save(line);
      if (response) {
        const ln = await this.lineRepo.findOne(
          { id: response.id },
          { relations: ['item', 'header', 'header.warehouse', 'header.businessPartner'] },
        );
        return ln;
        //      return response;
      }
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

  async postHeader(id: number): Promise<TransactionHeader> {
    const header = await this.headerRepo.findOne(
      { id },
      { relations: ['lines', 'lines.item', 'warehouse', 'businessPartner'] },
    );
    const invents: Inventory[] = [];
    const inventories = await this.inventoryRepo.find();
    header.lines.forEach((line) => {
      let itemInventory = inventories.find((inv) => inv.itemId === line.item.id);
      if (!itemInventory) {
        itemInventory = this.inventoryRepo.create({
          item: line.item,
          warehouse: header.warehouse,
          qtyOnHand: 0,
        });
      }
      itemInventory.qtyOnHand =
        header.type === TransactionType.Sale
          ? itemInventory.qtyOnHand - line.qty
          : header.type === TransactionType.Purchase
          ? itemInventory.qtyOnHand + line.qty
          : line.qty;
      invents.push(itemInventory);
    });
    const result = await this.inventoryRepo.save(invents);
    if (result) {
      const response = await this.headerRepo.save({ ...header, status: TransactionStatus.Posted });
      return response;
    }
  }
  async removeHeader(id: number): Promise<DelResult> {
    const del = await this.headerRepo.delete(id);
    const res = new DelResult();
    res.affectedRows = del.affected;
    return res;
  }
  async removeLine(id: number): Promise<TransactionHeader> {
    try {
      const line = await this.lineRepo.findOne({ id });
      const header = await this.headerRepo.findOne({ id: line.headerId });
      if (line && header) {
        header.totalAmount = header.totalAmount - line.eachPrice * line.qty;
        header.totalQty = header.totalQty - line.qty;
        header.numberOfItems = header.numberOfItems - 1;

        const del = await this.lineRepo.delete(id);
        const response = await this.headerRepo.save(header);
        return response;
        //const res = new DelResult();
        //res.affectedRows = del.affected;
        //return res;
      }
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

  // @Transaction()
  // save(
  //   user: TransactionHeader,
  //   @TransactionRepository(TransactionHeader) userRepository: Repository<TransactionHeader>,
  // ) {
  //   return userRepository.save(user);
  // }
}
