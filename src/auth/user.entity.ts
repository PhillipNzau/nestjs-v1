import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../tasks/task.entity";
import { Exclude, Expose } from "class-transformer";
import { SerializeOptions } from "@nestjs/common";

// export const GROUP_USER = 'group_user_details';
// @Expose({ groups: [GROUP_Admin] })
//  in controller @SerializeOptions({
//     groups: [GROUP_Admin],
// }),

export const GROUP_Admin = 'group_admin';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true})
    username: string;

    @Column()
    @Exclude()
    password: string

    @OneToMany((_type) => Task, (task: Task) => task.user, { eager: true})
    tasks: Task[];
}
