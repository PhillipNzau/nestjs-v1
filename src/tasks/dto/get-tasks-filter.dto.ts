import { TaskStatus } from "../tasks-status.model";
import {IsEnum, IsOptional, IsString} from "class-validator";

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
