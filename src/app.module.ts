import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './accnt/account.module';
import { UserModule } from './user/..module';
// import { AuthModule } from './auth/auth.module';\
// import authmodule
import { isPort } from 'class-validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import userFactory from './db/factories/user.factory';

const db_type = 'DB_TYPE';
const db_host = 'DB_HOST';
const db_port = 'DB_PORT';
const db_username = 'DB_USERNAME';
const db_pw = 'DB_PASSWORD';
const db_db = 'DB_DATABASE';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev', 'prod').required(),

      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService : ConfigService) => ({
        type: configService.get<string>(db_type) as 'postgres',
        host: configService.get<string>(db_host),
        port: configService.get<string>(db_port),
        username: configService.get<string>(db_username),
        password: configService.get<string>(db_pw),
        database: configService.get<string>(db_db),
        entities: [
            //Bank entity should be filled in for creating a table in postgres.
        ]
        // autoLoadEntities: ConfigService.get<string>(),
        // synchronize: ConfigService.get<string>(),
      }),
    }),
    AccountModule,
    UserModule,
    // AuthModule,
  ],
})
export class AppModule { }


/* 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
*/
