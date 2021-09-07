import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { BasicFields } from './basicFields';

@ObjectType()
export abstract class DisplayFields extends BasicFields {
  @Field()
  @Column({ unique: true })
  displayName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;
}
