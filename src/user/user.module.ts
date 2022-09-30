import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { User } from "../auth/user.entity";

@Module({
  imports: [  TypeOrmModule.forFeature([User]),
    AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
