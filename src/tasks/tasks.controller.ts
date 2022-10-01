import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get, Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
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
  private logger = new Logger('TaskController')
  constructor(
    private taskService: TasksService,
  ) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
    ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters "${JSON.stringify(filterDto)}" `)
      return this.taskService.getTasks(filterDto, user);
  }

  @Get(":id")
  async getTaskById(
    @Param("id") id: string,
    @GetUser() user: User,
    ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  async addTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`this user creating task with ${JSON.stringify(createTaskDto)}`)
    return this.taskService.addTask(createTaskDto, user);
  }

  @Delete(":id")
  async deleteTaskById(
    @Param("id") id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch(":id/status")
  async updateTaskStatusById(
    @Param("id") id: string,
    @GetUser() user: User,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ): Promise<Task> {
    const {status} = updateTaskStatusDto
    return this.taskService.updateTaskStatusById(id, status, user);
  }

}
