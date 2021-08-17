import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Category } from './category.entity';

@ObjectType()
@Entity({ name: 'items' })
export class Item extends DisplayFields {
  @Column()
  @Field()
  code: string;

  @Column({
    type: 'enum',
    enum: ['Purchased', 'Manufactured', 'Service'],
  })
  @Field()
  type: 'Purchased' | 'Manufactured' | 'Service';

  @ManyToOne((type) => Category)
  category: Category;

  @ManyToOne((type) => Category)
  unitOfMeasure: Category;
}
