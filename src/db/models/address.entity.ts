import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BasicFields } from '../common/basicFields';

@ObjectType()
@Entity({ name: 'addresses' })
export class Address extends BasicFields {
  @Column()
  @Field()
  country: string;
  @Column()
  @Field()
  city: string;
  @Column()
  @Field()
  subCity: string;
  @Column()
  @Field()
  streetAddress: string;
  @Column()
  @Field()
  woreda: string;
  @Column()
  @Field()
  kebele: string;
  @Column()
  @Field()
  houseNumber: string;
  @Column()
  @Field()
  telephone: string;
  @Column()
  @Field()
  alternateTelephone: string;
  @Column()
  @Field()
  email: string;
  @Column()
  @Field()
  alternateEmail: string;
  @Column()
  @Field()
  webAddress: string;
  @Column()
  @Field()
  fax: string;
  @Column()
  @Field()
  poBox: string;
  @Column()
  @Field()
  notes: string;
}
