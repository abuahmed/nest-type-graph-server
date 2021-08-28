import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//import { EasyconfigModule } from 'nestjs-easyconfig';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentsModule } from './components/components.module';
import * as ormOptions from './config/orm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormOptions),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
      debug: true,
    }),

    ComponentsModule,
  ],
})
export class AppModule {}

// cors: {
//   origin: '*',
//   methods: 'GET,PUT,PATCH,POST,DELETE',
//   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
//   // credentials: true,
//   // preflightContinue: false,
//   // optionsSuccessStatus: 204
// },
