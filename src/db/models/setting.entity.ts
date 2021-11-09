import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { TaxTypes } from '../enums/taxTypes';
import { Warehouse } from './warehouse.entity';
registerEnumType(TaxTypes, {
  name: 'TaxTypes',
});
@ObjectType()
@Entity({ name: 'settings' })
export class Setting extends BasicFields {
  @Column({ default: false })
  @Field()
  checkCreditLimit: boolean;

  @Column({ default: false })
  @Field()
  handleBankTransaction: boolean;

  @Column({ default: false })
  @Field()
  enableReservations: boolean;

  @Column({ default: false })
  @Field()
  enableCheckEntry: boolean;

  @Column({ default: false })
  @Field()
  postWithLessStock: boolean;

  @Column({
    default: TaxTypes.NoTax,
    enum: TaxTypes,
    type: 'enum',
  })
  @Field(() => TaxTypes)
  taxType: TaxTypes;

  @Column({ default: false })
  @Field()
  byDefaultItemsHaveThisTaxRate: boolean;

  @Column({ default: false })
  @Field()
  itemPricesAreTaxInclusive: boolean;

  @Column({ default: 0.0 })
  @Field()
  taxPercent: number;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  warehouseId: number;
  @OneToOne(() => Warehouse, { cascade: true, nullable: false })
  @JoinColumn()
  warehouse: Warehouse;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  lastInventoryUpdated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  lastPIUpdated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  lastPurchaseUpdated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  lastSalesUpdated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  lastItemsUpdated: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  lastBusinessPartnersUpdated: Date;
}
