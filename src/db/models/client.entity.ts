import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Organization } from './organization.entity';

@ObjectType()
@Entity({ name: 'client' })
export class Client extends DisplayFields {
  @Column({
    type: 'enum',
    enum: [
      'SingleOrgSingleStore',
      'SingleOrgMultiStore',
      'MultiOrgSingleStore',
      'MultiOrgMultiStore',
    ],
  })
  @Field()
  type:
    | 'SingleOrgSingleStore'
    | 'SingleOrgMultiStore'
    | 'MultiOrgSingleStore'
    | 'MultiOrgMultiStore';

  @OneToMany(() => Organization, (org) => org.client)
  organizations: Organization[];
  @ManyToOne(() => Address)
  address: Address;
}
