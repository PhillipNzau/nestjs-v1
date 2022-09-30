import {IsEnum} from "class-validator";
import {TaskStatus} from "../tasks-status.model";

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}
