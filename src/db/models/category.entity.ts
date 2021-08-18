import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { CategoryType } from '../enums/categoryType';

@ObjectType()
@Entity({ name: 'categories' })
export class Category extends DisplayFields {
  @Column({
    default: CategoryType.ItemCategory,
    enum: CategoryType,
    type: 'enum',
  })
  @Field(() => CategoryType)
  type: CategoryType;

  @ManyToOne(() => Category, (category) => category.childCategories)
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];
}
