import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { UserStatus } from '../enums/userStatus';
import { Role } from './role.entity';

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
  @Field()
  salt: string;

  @Column({ nullable: true })
  @Field()
  avatar: string;

  @Column({ nullable: true })
  @Field()
  bio: string;

  @Column({ default: false })
  @Field()
  isAdmin: boolean;

  @Column({
    default: UserStatus.Waiting,
    enum: UserStatus,
    type: 'enum',
  })
  @Field((type) => UserStatus)
  public status: UserStatus;

  @Column({ nullable: true })
  @Field()
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
}
