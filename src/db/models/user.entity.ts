import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Role } from './role.entity';

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

  @Column()
  @Field()
  salt: string;

  @Column()
  @Field()
  avatar: string;

  @Column()
  @Field()
  bio: string;

  @Column()
  @Field()
  isAdmin: boolean;

  @Column({
    type: 'enum',
    enum: ['Waiting', 'Active', 'Disabled', 'Blocked'],
  })
  @Field()
  status: 'Waiting' | 'Active' | 'Disabled' | 'Blocked';

  @Column()
  @Field()
  verifiedAt: Date;

  @Column()
  @Field()
  token: string;

  @Column()
  @Field()
  expiredAt: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
