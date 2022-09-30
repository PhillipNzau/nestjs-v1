import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TasksModule} from "./tasks/tasks.module";
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from './user/user.module';

// 172.17.0.3
@Module({
    imports: [
        TasksModule,
        AuthModule,
        TypeOrmModule.forRoot({
        type: 'postgres',
        host: '172.17.0.2',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'task-management',
        autoLoadEntities: true,
        synchronize: true,
    }),
        UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}

