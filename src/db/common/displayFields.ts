import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { BasicFields } from './basicFields';

export abstract class DisplayFields extends BasicFields {
  @Field()
  @Column()
  displayName: string;

  @Field()
  @Column()
  description: string;
}
