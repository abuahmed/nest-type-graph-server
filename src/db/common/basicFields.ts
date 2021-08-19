import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
@ObjectType()
export abstract class BasicFields {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @VersionColumn()
  version: number;

  @Column()
  @Field()
  @Generated('uuid')
  uuid: string;

  @Column({ default: true })
  @Field()
  isEnabled: boolean;

  @Column({ default: 1 })
  @Field()
  createdByUserId: number;

  @Column({ default: 1 })
  @Field()
  modifiedByUserId: number;

  @Field()
  @CreateDateColumn({ name: 'DateRecordCreated' })
  dateRecordCreated: Date;

  @Field()
  @UpdateDateColumn({ name: 'DateLastModified' })
  dateLastModified: Date;
}
