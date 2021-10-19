import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { ClientType } from '../enums/clientType';
import { Address } from './address.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';
registerEnumType(ClientType, {
  name: 'ClientType',
});
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

  @OneToMany(() => User, (org) => org.client)
  users: User[];

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  addressId: number;
  @OneToOne(() => Address, { cascade: true, nullable: false })
  @JoinColumn()
  address: Address;
}
