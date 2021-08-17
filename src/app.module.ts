import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
//import { EasyconfigModule } from 'nestjs-easyconfig';

import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { ComponentsModule } from './components/components.module';
import { MONGO_OPTIONS, MONGO_URI } from './config';

//ConfigModule.forRoot({isGlobal: true,  }),
@Module({
  imports: [
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
    MongooseModule.forRoot(MONGO_URI, MONGO_OPTIONS),
    ComponentsModule,
  ],
})
export class AppModule {}
