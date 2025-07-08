import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // No entity yet.
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// Sep.30th.2024 12:59 Set up JWT authentication in the auth module.
// Jul.08th.2025 10:43 Deleted original module file and reinstalled whole auth repo.
