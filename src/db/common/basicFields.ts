import { Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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

  @Column()
  @Field()
  createdByUserId!: number;

  @Column()
  @Field()
  modifiedByUserId!: number;

  @Field()
  @CreateDateColumn({ name: 'DateRecordCreated' })
  dateRecordCreated: Date;

  @Field()
  @UpdateDateColumn({ name: 'DateLastModified' })
  dateLastModified: Date;
}
