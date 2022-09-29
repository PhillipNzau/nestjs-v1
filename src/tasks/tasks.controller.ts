import { Body, Controller, Get, Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./tasks.model";

@Controller('tasks')

export class TasksController {
  constructor(private taskService: TasksService) {
  }

  @Get()
  getAllTasks(): Task[] {
    return this.taskService.getAllTasks();
  }

  @Post()
  addTask(
   @Body('title') title,
   @Body('description') description
  ): Task {
    return this.taskService.addTask(title,description)
  }

}
