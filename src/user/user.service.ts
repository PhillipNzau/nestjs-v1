import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../auth/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  private logger = new Logger('UserService')

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
  }

  ///////////
  // Get users
  async getUsers(user: User): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');
    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();

    }

  }

}
