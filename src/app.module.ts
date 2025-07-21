import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './accnt/account.module';
import { AuthMoule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { isPort } from 'class-validator';
import * as Joi from 'Joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envVariableKeys } from './common/constant/env.constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Loads process environment variables depending on the "ignoreEnvFile" flag and "envFilePath" value.
      isGlobal: true,
      // Environment variables validation schema (Joi).
      // Generates a schema object that matches an object data type (as well as JSON strings that have been parsed into objects).
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev', 'prod').required(),
        DB_TYPE: Joi.string().valid('postgres').required,
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        HASH_ROUNDS: Joi.number().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
      }),
    }), 
    TypeOrmModule.forRootAsync({
      useFactory: (configService : ConfigService) => ({
        type: configService.get<string>(envVariableKeys.db_type) as 'postgres',
        host: configService.get<string>(envVariableKeys.db_host),
        port: configService.get<number>(envVariableKeys.db_port),
        username: configService.get<string>(envVariableKeys.db_username),
        password: configService.get<string>(envVariableKeys.db_pw),
        database: configService.get<string>(envVariableKeys.db_db),
        entities: [
          // 
        ],
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    AccountModule,
    UserModule,
    AuthMoule,
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
