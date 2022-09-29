import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task, TaskStatus } from "./tasks.model";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Controller("tasks")

export class TasksController {
  constructor(private taskService: TasksService) {
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTasksWithFilters(filterDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }

  @Post()
  addTask(
    @Body() createTaskDto: CreateTaskDto
  ): Task {
    return this.taskService.addTask(createTaskDto);
  }

  @Get(":id")
  getSingleTask(@Param("id") id: string): Task {
    return this.taskService.getSingleTask(id);
  }

  @Delete(":id")
  deleteSingleTask(@Param("id") id: string): void {
    return this.taskService.deleteSingleTask(id);
  }

  @Patch(":id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @Body("status") status: TaskStatus
  ): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

}
