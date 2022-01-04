import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { BasicFields } from './basicFields';

@ObjectType()
export abstract class DisplayFields extends BasicFields {
  @Field()
  @Column({ unique: true })
  displayName: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '', nullable: true })
  description?: string;
}
