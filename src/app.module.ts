import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './accnt/account.module';
import { UserModule } from './user/..module';
// import { AuthModule } from './auth/auth.module';\
// import authmodule
import { isPort } from 'class-validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import Joi from 'joi';
import userFactory from './db/factories/user.factory';
import { CacheModule } from '@nestjs/cache-manager';
import { UserEntity } from './user/user.entity';
import { AccountEntity } from './accnt/account.entity';
import { TrscEntity } from './trsc/trsc.entity';
import { SwaggerModule } from '@nestjs/swagger';
import { TrscModule } from './trsc/trsc.module';
import { envVariableKeys } from './common/constant/env.constant';

@Module({
  //* in-memory caching with default settings, allowing you to start caching data immediately.
  // imports: [CacheModule.register()],

  imports: [
    CacheModule.register(),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ENV: Joi.string().valid('dev', 'prod').required(),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }), //Globally able to use in external modules.
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>(envVariableKeys.db_type) as 'postgres',
        host: configService.get<string>(envVariableKeys.db_host),
        port: configService.get<number>(envVariableKeys.db_port),
        username: configService.get<string>(envVariableKeys.db_username),
        password: configService.get<string>(envVariableKeys.db_pw),
        database: configService.get<string>(envVariableKeys.db_db),
        entities: [
          AccountEntity,
          UserEntity,
          TrscEntity,
          //Bank entity should be filled in for creating a table in postgres.
        ],
        synchronize: true,
        // autoLoadEntities: ConfigService.get<string>(),
        // synchronize: ConfigService.get<string>(),
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    AuthModule,
    UserModule,
    SwaggerModule,
    TrscModule,
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
