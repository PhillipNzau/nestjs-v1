import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  SerializeOptions,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { GetUser } from "../auth/get-user.decorator";
import { GROUP_Admin, User } from "../auth/user.entity";

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard())
export class UserController {
  private logger = new Logger('UserController')
  constructor(private userService: UserService) {
  }

  @Get()
  async getUsers(
    @GetUser() user: User
  ): Promise<User[]> {
    return this.userService.getUsers(user);
  }
}
