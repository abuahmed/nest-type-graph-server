import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
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

  @Column({ unique: true, nullable: true })
  @Field()
  code?: string;

  @ManyToOne(() => Category, { cascade: true, nullable: false })
  @Field(() => Category)
  itemCategory: Category;

  @ManyToOne(() => Category, { cascade: true, nullable: false })
  @Field(() => Category)
  unitOfMeasure: Category;
}
