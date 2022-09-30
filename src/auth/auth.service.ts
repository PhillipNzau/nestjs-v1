import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "./user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {AuthCredentialsDto} from "./dto/auth-credentials.dto";
import * as bcrypt  from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    /////////////////
    // Create new user
    async createUser (authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authCredentialsDto;

        // hash pwd
        const salt = await bcrypt.genSalt();
        const hashedPwd = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username,
            password: hashedPwd
        });
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    /////////////////
    // Sign in user
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOneBy({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            return 'success'
        } else {
            throw new UnauthorizedException('Please check credentials');
        }

    }
}
