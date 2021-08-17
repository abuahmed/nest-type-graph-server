import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BasicFields } from '../common/basicFields';

@ObjectType()
@Entity({ name: 'commons' })
export class Common extends BasicFields {
  @Column()
  @Field()
  name: string;
}
