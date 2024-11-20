// src/database/db.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // name : '',   //When to use name, need to set the data source name outside useFactory.
        useFactory: async (configService: ConfigService) => ({
        type: 'postgres', //datatype
        host: configService.get('DB_HOST'), //database host
        port: configService.get('DB_PORT'), //database host port
        username: configService.get('DB_USERNAME'), //database name
        password: configService.get('DB_PASSWORD'), //db pw
        database: configService.get('DB_NAME'), //db name to connect to 
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], //entities and repos where need to be loaded at
        synchronize: configService.get('NODE_ENV') !== 'production',  //db scheme creation on every application launch
        logging: configService.get('NODE_ENV') !== 'production',  //db logging option
        ssl: configService.get('NODE_ENV') === 'production' ? { //getting ssl configuration object 
          rejectUnauthorized: false,  //if true, server to be disconnected unauthorized list of supplied CAs
        } : false,  //why is this false?
        autoLoadEntities: true, //automatical entity load
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],  //migration pathway
        migrationsRun: true,  //option whether migration to be automatic run
        keepConnectionAlive: true,  //application connect in background
        poolSize: 20, //client pooling scale
        connectionTimeoutMillis: 10000, //connection timeout
        maxQueryExecutionTime: 5000,  //logger warning of maximun query execution
      }),
      inject: [ConfigService],
      // Add support for transactions
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
})
export class DatabaseModule { }
