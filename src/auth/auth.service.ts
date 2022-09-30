import {ConflictException, Injectable, InternalServerErrorException} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createUser (authCredentialsDto: AuthCredentialsDto): Promise<void> {

        const {username, password} = authCredentialsDto;
        const user = this.userRepository.create({
            username,
            password
        });
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === 23505) {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException();
            }
            console.log(error.code)
        }

    }
}
