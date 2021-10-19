import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { UserStatus } from '../enums/userStatus';
import { Client } from './client.entity';
import { Role } from './role.entity';
import { Warehouse } from './warehouse.entity';

registerEnumType(UserStatus, {
  name: 'UserStatus',
});
@ObjectType()
@Entity({ name: 'users' })
export class User extends BasicFields {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bio: string;

  @Column({ default: false })
  @Field()
  isAdmin: boolean;

  @Column({
    default: UserStatus.Waiting,
    enum: UserStatus,
    type: 'enum',
  })
  @Field(() => UserStatus)
  status: UserStatus;

  @Column({ nullable: true })
  @Field({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  @Field()
  token: string;

  @Column({ nullable: true })
  @Field()
  expiredAt: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  @Field(() => [Role])
  roles: Role[];

  @ManyToMany(() => Warehouse)
  @JoinTable()
  @Field(() => [Warehouse])
  warehouses: Warehouse[];

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  clientId: number;

  @ManyToOne(() => Client)
  client: Client;
}
