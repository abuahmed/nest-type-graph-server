import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { DisplayFields } from '../common/displayFields';

@ObjectType()
@Entity({ name: 'roles' })
export class Role extends DisplayFields {
  @Column()
  @Field()
  descriptionShort: string;
}
