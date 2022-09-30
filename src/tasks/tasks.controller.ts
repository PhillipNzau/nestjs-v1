import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TaskStatus } from "./tasks-status.model";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import {UpdateTaskStatusDto} from "./dto/update-task-status.dto";
import {Task} from "./task.entity";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/get-user.decorator";
import { User } from "../auth/user.entity";

@Controller("tasks")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {
  }

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
    ): Promise<Task[]> {
      return this.taskService.getTasks(filterDto, user);
  }

  @Post()
  async addTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.addTask(createTaskDto, user);
  }

  @Get(":id")
  async getTaskById(@Param("id") id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Delete(":id")
  async deleteTaskById(@Param("id") id: string): Promise<void> {
    return this.taskService.deleteTaskById(id);
  }

  @Patch(":id/status")
  async updateTaskStatusById(
    @Param("id") id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ): Promise<Task> {
    const {status} = updateTaskStatusDto
    return this.taskService.updateTaskStatusById(id, status);
  }

}
