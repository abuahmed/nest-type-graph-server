import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Connection, QueryRunner, Repository } from 'typeorm';
import {
  DailyTransactionsSummary,
  InventorySummary,
  LineSummary,
  PaymentInput,
  SummaryInput,
  TransactionLineInput,
  HeadersWithCount,
  InventoriesWithCount,
  LinesWithCount,
  PaymentsWithCount,
} from '../dto/transaction.input';
import { InventoryArgs, LineArgs, PaymentArgs, TransactionArgs } from './dto/transaction.args';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { startOfDay, endOfDay } from 'date-fns';
import { DelResult } from '../user/dto/user.dto';
import { TransactionStatus } from 'src/db/enums/transactionStatus';
import { Inventory } from 'src/db/models/inventory.entity';
import { TransactionType } from 'src/db/enums/transactionType';
import { Payment } from 'src/db/models/payment.entity';
import { PaymentMethods } from 'src/db/enums/paymentEnums';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';

@Injectable()
export class TransactionService {
  constructor(
    private connection: Connection,
    @InjectRepository(TransactionHeader)
    private readonly headerRepo: Repository<TransactionHeader>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(TransactionLine)
    private readonly lineRepo: Repository<TransactionLine>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(BusinessPartner)
    private readonly businessPartnerRepo: Repository<BusinessPartner>,
  ) {}

  async create(header: CreateTransactionInput): Promise<TransactionHeader> {
    try {
      const transaction = header.id
        ? await this.headerRepo.preload(header)
        : this.headerRepo.create(header);

      const response = await this.headerRepo.save(transaction);
      if (response) {
        return await this.findOne(response.id);
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

  async findAll(transactionArgs: TransactionArgs): Promise<HeadersWithCount> {
    const {
      type,
      searchText,
      warehouseId,
      businessPartnerId,
      durationBegin: startDate,
      durationEnd: endDate,
      skip,
      take,
    } = transactionArgs;

    // const summary: DailyTransactionsSummary[] = await this.currentTransactions({
    //   ...transactionArgs,
    //   take: undefined,
    // });
    let transactionsQB = this.headerRepo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.warehouse', 'Warehouse');
    if (searchText) {
      transactionsQB = transactionsQB.andWhere(`t.id Like("%${searchText}%")`);
    } else {
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
    }

    //console.log(transactionsQB.getSql());
    const rows = await transactionsQB
      .take(take)
      .skip(skip)
      .orderBy('t.transactionDate', 'DESC')
      .getManyAndCount();

    return {
      headers: rows[0] as TransactionHeader[],
      totalCount: rows[1],
    };
  }

  async findLines(lineArgs: LineArgs): Promise<LinesWithCount> {
    const {
      headerId,
      warehouseId,
      itemId,
      includeSales,
      includePurchases,
      includePIs,
      includeTransfers,
      durationBegin: startDate,
      durationEnd: endDate,
      status,
      searchText,
      skip,
      take,
    } = lineArgs;
    const tranTypes: TransactionType[] = [];
    if (includeSales) tranTypes.push(TransactionType.Sale);
    if (includePurchases) tranTypes.push(TransactionType.Purchase);
    if (includePIs) tranTypes.push(TransactionType.PI);
    if (includeTransfers) tranTypes.push(TransactionType.Transfer);

    if (!headerId && tranTypes.length === 0) return { totalCount: 0, lines: [] };
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
      if (warehouseId) {
        linesQB = linesQB.andWhere('warehouse.id = :warehouseId', {
          warehouseId: warehouseId,
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
    }

    if (searchText) {
      linesQB = linesQB.andWhere(`item.displayName Like("%${searchText}%")`);
    }

    let rows: any[];

    if (take === -1)
      rows = await linesQB.orderBy('header.transactionDate', 'DESC').getManyAndCount();
    else
      rows = await linesQB
        .take(take)
        .skip(skip)
        .orderBy('header.transactionDate', 'DESC')
        .getManyAndCount();

    return {
      lines: rows[0],
      totalCount: rows[1],
    };
  }

  async findPayments(paymentArgs: PaymentArgs): Promise<PaymentsWithCount> {
    const {
      headerId,
      durationBegin: startDate,
      durationEnd: endDate,
      status,
      type,
      method,
      skip,
      take,
    } = paymentArgs;
    let paymentsQB = this.paymentRepo
      .createQueryBuilder('p')
      .innerJoinAndSelect('p.header', 'header')
      .innerJoinAndSelect('header.warehouse', 'warehouse');
    if (headerId) {
      paymentsQB = paymentsQB.andWhere('p.headerId = :headerId', {
        headerId: headerId,
      });
    } else {
      if (type) {
        paymentsQB = paymentsQB.andWhere('p.type = :type', {
          type: type,
        });
      }

      if (method) {
        paymentsQB = paymentsQB.andWhere('p.method = :method', {
          method: method,
        });
      }

      if (status) {
        paymentsQB = paymentsQB.andWhere('p.status = :status', {
          status: status,
        });
      }
    }

    if (startDate && endDate) {
      paymentsQB = paymentsQB.andWhere('p.paymentDate BETWEEN :startDate AND :endDate', {
        startDate: startOfDay(startDate).toISOString(),
        endDate: endOfDay(endDate).toISOString(),
      });
    }
    let rows: any[];

    if (take === -1)
      rows = await paymentsQB.orderBy('header.transactionDate', 'DESC').getManyAndCount();
    else
      rows = await paymentsQB
        .take(take)
        .skip(skip)
        .orderBy('header.transactionDate', 'DESC')
        .getManyAndCount();

    return {
      payments: rows[0],
      totalCount: rows[1],
    };
  }

  async findInventories(inventoryArgs: InventoryArgs): Promise<InventoriesWithCount> {
    const { warehouseId, itemId, searchText, categoryId, uomId, skip, take } = inventoryArgs;
    let inventoriesQB = this.inventoryRepo
      .createQueryBuilder('inv')
      .innerJoinAndSelect('inv.warehouse', 'warehouse')
      .innerJoinAndSelect('inv.item', 'item')
      .innerJoinAndSelect('item.itemCategory', 'cat')
      .innerJoinAndSelect('item.unitOfMeasure', 'uom');
    if (warehouseId) {
      inventoriesQB = inventoriesQB.andWhere('warehouse.id = :warehouseId', {
        warehouseId,
      });
    }
    if (itemId) {
      inventoriesQB = inventoriesQB.andWhere('item.id = :itemId', {
        itemId,
      });
    }
    if (searchText) {
      inventoriesQB = inventoriesQB.andWhere(`item.displayName Like("%${searchText}%")`);
    }
    if (categoryId) {
      inventoriesQB = inventoriesQB.andWhere('cat.id = :categoryId', {
        categoryId,
      });
    }
    if (uomId) {
      inventoriesQB = inventoriesQB.andWhere('uom.id = :uomId', {
        uomId,
      });
    }
    let rows: any[];

    if (take === -1) rows = await inventoriesQB.orderBy('item.displayName').getManyAndCount();
    else
      rows = await inventoriesQB
        .take(take)
        .skip(skip)
        .orderBy('item.displayName')
        .getManyAndCount();

    return {
      inventories: rows[0],
      totalCount: rows[1],
    };
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
            'payments',
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

  async getLineUpdates(id: number): Promise<Inventory[]> {
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

      return invents;
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

  async getPostedHeader(id: number): Promise<TransactionHeader> {
    try {
      const header: TransactionHeader = await this.findOne(id);
      if (header) {
        header.status = TransactionStatus.Posted;
        return header;
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
  async postHeader(id: number): Promise<TransactionHeader> {
    const queryRunner = await this.getQueryRunner();

    try {
      const header = await this.getPostedHeader(id);
      await queryRunner.manager.save(header);

      const invents = await this.getLineUpdates(id);
      await queryRunner.manager.save(invents);

      await queryRunner.commitTransaction();
      return header;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getPayments(paymentInput: PaymentInput): Promise<Payment[]> {
    try {
      const { amount, amountRequired } = paymentInput;
      const payments: Payment[] = [];
      const cashPayment = this.paymentRepo.create(paymentInput);
      payments.push(cashPayment);

      if (amount !== amountRequired) {
        const creditAmount = amountRequired - amount;
        const creditPayment = this.paymentRepo.create({
          ...paymentInput,
          amount: creditAmount,
          method: PaymentMethods.Credit,
        });
        payments.push(creditPayment);
      }
      return payments;
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
  async getQueryRunner(): Promise<QueryRunner> {
    try {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
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
    const { headerId, amount, amountRequired } = paymentInput;
    const queryRunner = await this.getQueryRunner();
    try {
      const header = await this.getPostedHeader(headerId);
      await queryRunner.manager.save(header);
      const payments = await this.getPayments(paymentInput);
      await queryRunner.manager.save(payments);
      if (amount !== amountRequired) {
        //Add Outstanding credit to the Business Partner
        const bp = await this.businessPartnerRepo.findOne({ id: header.businessPartner.id });
        const creditAmount = amountRequired - amount;
        bp.totalOutstandingCredit = bp.totalOutstandingCredit + creditAmount;
        await queryRunner.manager.save(bp);
      }
      await queryRunner.manager.save(await this.getLineUpdates(headerId));

      await queryRunner.commitTransaction();

      return header;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: err,
          message: err.message,
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async unPostHeader(id: number): Promise<TransactionHeader> {
    try {
      const header = await this.headerRepo.findOne(
        { id },
        {
          relations: ['lines', 'lines.item', 'warehouse', 'toWarehouse', 'businessPartner'],
        },
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
      groupByDate,
      take,
    } = transactionArgs;
    let transactionsQB = this.headerRepo
      .createQueryBuilder('t')
      .innerJoin('t.warehouse', 'Warehouse')
      .select('COUNT(t.id)', 'totalTransactions')
      .addSelect('SUM(t.totalAmount)', 'totalAmount');
    // if (type === TransactionType.Sale || type === TransactionType.Purchase) {
    //   transactionsQB = transactionsQB
    // }
    if (groupByDate) {
      transactionsQB = transactionsQB.addSelect(
        'DATE_FORMAT(t.transactionDate, "%m/%d/%Y")',
        'transactionDate',
      );
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
    if (groupByDate) {
      transactionsQB = transactionsQB.groupBy('DATE_FORMAT(t.transactionDate, "%m/%d/%Y")');
      if (take) transactionsQB = transactionsQB.limit(take);
      return await transactionsQB.orderBy('transactionDate', 'ASC').getRawMany();
    } else {
      return await transactionsQB.getRawMany();
      // if (type === TransactionType.Sale || type === TransactionType.Purchase) {
      //   return result;
      // } else {
      //   return [{ ...result[0], totalAmount: 0 }];
      // }
    }
  }
}
