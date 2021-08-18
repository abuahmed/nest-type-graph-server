import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { ItemType } from '../enums/itemType';
import { Category } from './category.entity';

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

  @Column()
  @Field()
  code: string;

  @ManyToOne(() => Category)
  category: Category;

  @ManyToOne(() => Category)
  unitOfMeasure: Category;
}
