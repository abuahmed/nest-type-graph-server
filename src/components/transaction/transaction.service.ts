import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Repository } from 'typeorm';
import {
  DailyTransactionsSummary,
  InventorySummary,
  LineSummary,
  PaymentInput,
  SummaryInput,
  TransactionLineInput,
} from '../dto/transaction.input';
import { InventoryArgs, LineArgs, TransactionArgs } from './dto/transaction.args';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { startOfDay, endOfDay } from 'date-fns';
import { DelResult } from '../user/dto/user.dto';
import { TransactionStatus } from 'src/db/enums/transactionStatus';
import { Inventory } from 'src/db/models/inventory.entity';
import { TransactionType } from 'src/db/enums/transactionType';
import { Setting } from 'src/db/models/setting.entity';
import { Payment } from 'src/db/models/payment.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionHeader)
    private readonly headerRepo: Repository<TransactionHeader>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
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
      if (response) {
        return await this.headerRepo.findOne({
          relations: ['warehouse', 'toWarehouse', 'businessPartner'],
          where: { id: response.id },
        });
      }
      //return response;
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

      if (header.type === TransactionType.PI) {
        transaction.totalAmount = transaction.totalAmount
          ? Number(transaction.totalAmount) + Number(line.eachPrice) * Number(line.diff)
          : line.eachPrice * line.diff;
      } else {
        transaction.totalAmount = transaction.totalAmount
          ? Number(transaction.totalAmount) + Number(line.eachPrice) * Number(line.qty)
          : line.eachPrice * line.qty;
      }

      transaction.totalQty = transaction.totalQty
        ? Number(transaction.totalQty) + Number(line.qty)
        : line.qty;
      transaction.numberOfItems = transaction.numberOfItems
        ? Number(transaction.numberOfItems) + Number(1)
        : 1;
      if (prevLine) {
        transaction.totalAmount = transaction.totalAmount - prevLine.eachPrice * prevLine.qty;
        transaction.totalQty = transaction.totalQty - prevLine.qty;
        transaction.numberOfItems = transaction.numberOfItems - 1;
      }

      line.header = transaction;

      const response = await this.lineRepo.save(line);
      if (response) {
        //fetch line with its relations
        const ln = await this.lineRepo.findOne(
          { id: response.id },
          {
            relations: [
              'item',
              'header',
              'header.warehouse',
              'header.toWarehouse',
              'header.businessPartner',
            ],
          },
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
      .innerJoinAndSelect('t.warehouse', 'Warehouse');
    if (type === TransactionType.Transfer) {
      transactionsQB = transactionsQB.innerJoinAndSelect('t.toWarehouse', 'ToWarehouse');
    } else if (type === TransactionType.Sale || type === TransactionType.Purchase) {
      transactionsQB = transactionsQB.innerJoinAndSelect('t.businessPartner', 'BusinessPartner');
    }
    transactionsQB = transactionsQB.where('t.type = :type', {
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
    return await transactionsQB
      .take(take)
      .skip(skip)
      .orderBy('t.transactionDate', 'DESC')
      .getMany();
  }

  async findLines(lineArgs: LineArgs): Promise<TransactionLine[]> {
    const {
      headerId,
      itemId,
      includeSales,
      includePurchases,
      includePIs,
      includeTransfers,
      durationBegin: startDate,
      durationEnd: endDate,
      status,
      skip,
      take,
    } = lineArgs;

    const tranTypes: TransactionType[] = [];
    if (includeSales) tranTypes.push(TransactionType.Sale);
    if (includePurchases) tranTypes.push(TransactionType.Purchase);
    if (includePIs) tranTypes.push(TransactionType.PI);
    if (includeTransfers) tranTypes.push(TransactionType.Transfer);

    if (!headerId && tranTypes.length === 0) return [];
    let linesQB = this.lineRepo
      .createQueryBuilder('l')
      .innerJoinAndSelect('l.header', 'header')
      .innerJoinAndSelect('header.warehouse', 'warehouse')
      .innerJoinAndSelect('l.item', 'item');
    //.innerJoinAndSelect('header.businessPartner', 'businessPartner');

    if (headerId) {
      linesQB = linesQB.andWhere('l.headerId = :headerId', {
        headerId: headerId,
      });
    } else {
      linesQB = linesQB.andWhere('header.status = :status', {
        status: status,
      });

      linesQB = linesQB.andWhere('header.type IN (:type)', {
        type: tranTypes,
      });
    }
    if (itemId) {
      linesQB = linesQB.andWhere('item.id = :itemId', {
        itemId: itemId,
      });
    }
    if (startDate && endDate) {
      linesQB = linesQB.andWhere('header.transactionDate BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(startDate).toISOString(),
        endDate: endOfDay(endDate).toISOString(),
      });
    }

    return await linesQB.take(take).skip(skip).orderBy('header.transactionDate', 'DESC').getMany();
  }
  async findInventories(inventoryArgs: InventoryArgs): Promise<Inventory[]> {
    const { warehouseId, skip, take } = inventoryArgs;
    let inventoriesQB = this.inventoryRepo
      .createQueryBuilder('inv')
      .innerJoinAndSelect('inv.warehouse', 'warehouse')
      .innerJoinAndSelect('inv.item', 'item')
      .innerJoinAndSelect('item.itemCategory', 'cat')
      .innerJoinAndSelect('item.unitOfMeasure', 'uom');
    if (warehouseId) {
      inventoriesQB = inventoriesQB.andWhere('inv.warehouseId = :warehouseId', {
        warehouseId,
      });
    }

    return await inventoriesQB.take(take).skip(skip).orderBy('item.displayName').getMany();
  }

  async findOne(id: number) {
    try {
      return await this.headerRepo.findOne(
        { id },
        {
          relations: [
            'warehouse',
            'toWarehouse',
            'businessPartner',
            'lines',
            'lines.item',
            'lines.item.itemCategory',
            'lines.item.unitOfMeasure',
          ],
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
  async getItemInventory(id: number): Promise<Inventory> {
    try {
      return await this.inventoryRepo.findOne(
        { item: { id } },
        { relations: ['warehouse', 'item', 'item.itemCategory', 'item.unitOfMeasure'] },
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
    try {
      const header = await this.headerRepo.findOne(
        { id },
        { relations: ['lines', 'lines.item', 'warehouse', 'toWarehouse', 'businessPartner'] },
      );
      const invents: Inventory[] = [];
      if (header.type === TransactionType.Transfer) {
        const fromInventories = await this.inventoryRepo.find({ warehouseId: header.warehouse.id });
        const toInventories = await this.inventoryRepo.find({
          warehouseId: header?.toWarehouse.id,
        });
        header.lines.forEach((line) => {
          let fromItemInventory = fromInventories.find((inv) => inv.itemId === line.item.id);
          if (!fromItemInventory) {
            fromItemInventory = this.inventoryRepo.create({
              item: line.item,
              warehouse: header.warehouse,
              qtyOnHand: 0,
            });
          }
          fromItemInventory.qtyOnHand = fromItemInventory.qtyOnHand - line.qty;
          invents.push(fromItemInventory);

          let toItemInventory = toInventories.find((inv) => inv.itemId === line.item.id);
          if (!toItemInventory) {
            toItemInventory = this.inventoryRepo.create({
              item: line.item,
              warehouse: header.toWarehouse,
              qtyOnHand: 0,
            });
          }
          toItemInventory.qtyOnHand = Number(toItemInventory.qtyOnHand) + Number(line.qty);
          invents.push(toItemInventory);
          console.log(invents);
        });
      } else {
        const inventories = await this.inventoryRepo.find({ warehouseId: header.warehouse.id });
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
              ? Number(itemInventory.qtyOnHand) + Number(line.qty)
              : line.qty;
          invents.push(itemInventory);
        });
      }

      const result = await this.inventoryRepo.save(invents);
      if (result) {
        const response = await this.headerRepo.save({
          ...header,
          status: TransactionStatus.Posted,
        });

        return response;
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
  async postHeaderWithPayment(paymentInput: PaymentInput): Promise<TransactionHeader> {
    try {
      // const { headerId, paymentDate, amount, amountRequired } = payment;
      const payment = this.paymentRepo.create(paymentInput);
      const result = await this.paymentRepo.save(payment);
      if (result) {
        return await this.postHeader(paymentInput.headerId);
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
  async unPostHeader(id: number): Promise<TransactionHeader> {
    try {
      const header = await this.headerRepo.findOne(
        { id },
        { relations: ['lines', 'lines.item', 'warehouse', 'toWarehouse', 'businessPartner'] },
      );
      const invents: Inventory[] = [];
      if (header.type === TransactionType.Transfer) {
        const fromInventories = await this.inventoryRepo.find({ warehouseId: header.warehouse.id });
        const toInventories = await this.inventoryRepo.find({
          warehouseId: header?.toWarehouse.id,
        });
        header.lines.forEach((line) => {
          const fromItemInventory = fromInventories.find((inv) => inv.itemId === line.item.id);
          fromItemInventory.qtyOnHand = Number(fromItemInventory.qtyOnHand) + Number(line.qty);
          invents.push(fromItemInventory);

          const toItemInventory = toInventories.find((inv) => inv.itemId === line.item.id);
          toItemInventory.qtyOnHand = toItemInventory.qtyOnHand - line.qty;
          invents.push(toItemInventory);
        });
      } else {
        const inventories = await this.inventoryRepo.find({ warehouseId: header.warehouse.id });
        header.lines.forEach((line) => {
          const itemInventory = inventories.find((inv) => inv.itemId === line.item.id);

          itemInventory.qtyOnHand =
            header.type === TransactionType.Sale
              ? Number(itemInventory.qtyOnHand) + Number(line.qty)
              : header.type === TransactionType.Purchase
              ? itemInventory.qtyOnHand - line.qty
              : itemInventory.qtyOnHand - line.diff;
          invents.push(itemInventory);
        });
      }
      const result = await this.inventoryRepo.save(invents);
      if (result) {
        const response = await this.headerRepo.save({ ...header, status: TransactionStatus.Draft });

        return response;
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

  async findInventorySummary(inventoryArgs: InventoryArgs): Promise<SummaryInput[]> {
    const { warehouseId, skip, take } = inventoryArgs;
    let inventoriesQB = this.inventoryRepo
      .createQueryBuilder('inv')
      .innerJoinAndSelect('inv.warehouse', 'warehouse')
      .innerJoinAndSelect('inv.item', 'item');
    if (warehouseId) {
      inventoriesQB = inventoriesQB.andWhere('inv.warehouseId = :warehouseId', {
        warehouseId,
      });
    }

    const result = await inventoriesQB.take(take).skip(skip).orderBy('item.displayName').getMany();
    let purchaseValue = 0.0;
    let saleValue = 0.0;

    result.forEach((element) => {
      purchaseValue = purchaseValue + element.qtyOnHand * element.item.purchasePrice;
      saleValue = saleValue + element.qtyOnHand * element.item.sellingPrice;
    });
    return [
      { summaryValue: result.length },
      { summaryValue: purchaseValue },
      { summaryValue: saleValue },
      { summaryValue: saleValue - purchaseValue },
    ];
  }
  async calculateInventorySummary(inventoryArgs: InventoryArgs): Promise<InventorySummary> {
    const { warehouseId, skip, take } = inventoryArgs;
    let inventoriesQB = this.inventoryRepo
      .createQueryBuilder('inv')
      .innerJoin('inv.warehouse', 'warehouse')
      .innerJoin('inv.item', 'item')
      .select('COUNT(inv.id)', 'totalItems')
      .addSelect('warehouse.id', 'warehouseId')
      .addSelect('SUM(inv.qtyOnHand * item.purchasePrice)', 'totalPurchases')
      .addSelect('SUM(inv.qtyOnHand * item.sellingPrice)', 'totalSales');
    if (warehouseId) {
      inventoriesQB = inventoriesQB.andWhere('inv.warehouseId = :warehouseId', {
        warehouseId,
      });
    }
    inventoriesQB = inventoriesQB.groupBy('warehouse.id');
    return await inventoriesQB.take(take).skip(skip).getRawOne();
  }

  async topItems(lineArgs: LineArgs): Promise<LineSummary[]> {
    const {
      warehouseId,
      includeSales,
      includePurchases,
      durationBegin: startDate,
      durationEnd: endDate,
      status,
      skip,
      take,
    } = lineArgs;

    const tranTypes: TransactionType[] = [];
    if (includeSales) tranTypes.push(TransactionType.Sale);
    if (includePurchases) tranTypes.push(TransactionType.Purchase);

    let linesQB = this.lineRepo
      .createQueryBuilder('l')
      .innerJoin('l.header', 'header')
      .innerJoin('header.warehouse', 'warehouse')
      .innerJoin('header.businessPartner', 'businessPartner')
      .innerJoin('l.item', 'item')
      .select('COUNT(item.id)', 'totalTransactions')
      .addSelect('item.id', 'itemId')
      .addSelect('item.displayName', 'itemName')
      .addSelect('SUM(l.qty * l.eachPrice)', 'totalAmount');

    linesQB = linesQB.andWhere('header.status = :status', {
      status: status,
    });

    linesQB = linesQB.andWhere('header.type IN (:type)', {
      type: tranTypes,
    });

    if (startDate && endDate) {
      linesQB = linesQB.andWhere('header.transactionDate BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(startDate).toISOString(),
        endDate: endOfDay(endDate).toISOString(),
      });
    }

    if (warehouseId) {
      linesQB = linesQB.andWhere('warehouse.id = :warehouseId', {
        warehouseId,
      });
    }

    linesQB = linesQB.groupBy('item.id');
    linesQB = linesQB.limit(5);

    return await linesQB.orderBy('totalAmount', 'DESC').getRawMany();
  }

  async currentTransactions(transactionArgs: TransactionArgs): Promise<DailyTransactionsSummary[]> {
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
      .innerJoin('t.warehouse', 'Warehouse')
      .innerJoin('t.businessPartner', 'BusinessPartner')
      .select('COUNT(t.id)', 'totalTransactions')
      .addSelect('DATE_FORMAT(t.transactionDate, "%m/%d/%Y")', 'transactionDate')
      .addSelect('SUM(t.totalAmount)', 'totalAmount')
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

    transactionsQB = transactionsQB.groupBy('DATE_FORMAT(t.transactionDate, "%m/%d/%Y")');
    transactionsQB = transactionsQB.limit(7);

    return await transactionsQB.orderBy('transactionDate', 'ASC').getRawMany();
  }
}
