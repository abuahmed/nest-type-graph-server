import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { ItemType } from '../enums/itemType';
import { Category } from './category.entity';
registerEnumType(ItemType, {
  name: 'ItemType',
});
@ObjectType()
@Entity({ name: 'items' })
export class Item extends DisplayFields {
  @Column({
    default: ItemType.Purchased,
    enum: ItemType,
    type: 'enum',
  })
  @Field(() => ItemType)
  type: ItemType;

  // @Column({ unique: true, nullable: true })
  // @Field()
  // code?: string;

  @Column({ nullable: true, default: '' })
  @Field({ defaultValue: '' })
  pictureUrl?: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  itemCategoryId: number;

  @ManyToOne(() => Category, { cascade: true, nullable: false })
  @Field(() => Category)
  itemCategory: Category;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  unitOfMeasureId: number;

  @ManyToOne(() => Category, { cascade: true, nullable: false })
  @Field(() => Category)
  unitOfMeasure: Category;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float, { nullable: true })
  purchasePrice?: number;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float, { nullable: true })
  sellingPrice?: number;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float, { nullable: true })
  safeQty?: number;
}
