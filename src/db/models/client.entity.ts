import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { ClientType } from '../enums/clientType';
import { Address } from './address.entity';
import { Organization } from './organization.entity';

@ObjectType()
@Entity({ name: 'clients' })
export class Client extends DisplayFields {
  @Column({
    default: ClientType.SingleOrgSingleStore,
    enum: ClientType,
    type: 'enum',
  })
  @Field(() => ClientType)
  type: ClientType;

  @OneToMany(() => Organization, (org) => org.client)
  organizations: Organization[];
  @ManyToOne(() => Address)
  address: Address;
}
