import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccntUserAuthModule } from './accnt-user-auth/accnt-user-auth.module';

@Module({
  imports: [AccntUserAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
