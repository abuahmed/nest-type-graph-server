import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';

@ObjectType()
@Entity({ name: 'categories' })
export class Category extends DisplayFields {
  @Column({
    type: 'enum',
    enum: ['Category', 'UnitOfMeasure'],
  })
  @Field()
  nameType: 'Category' | 'UnitOfMeasure';

  @ManyToOne((type) => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany((type) => Category, (category) => category.parentCategory)
  childCategories: Category[];
}
