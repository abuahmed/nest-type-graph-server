import { Module } from '@nestjs/common';
//import { EasyconfigModule } from 'nestjs-easyconfig';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentsModule } from './components/components.module';
import { ItemModule } from './components/item/item.module';
import * as ormOptions from './config/orm';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormOptions),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      cors: {
        origin: '*',
        methods: 'GET,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        // credentials: true,
        // preflightContinue: false,
        // optionsSuccessStatus: 204
      },
      playground: true,
    }),

    ComponentsModule,
  ],
})
export class AppModule {}
