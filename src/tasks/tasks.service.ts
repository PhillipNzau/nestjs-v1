import { Injectable } from "@nestjs/common";
import { Task, TaskStatus } from "./tasks.model";
import { v4 as uuid } from "uuid";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()

export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const {status, search} =filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task: Task) => task.status === status)
    }

    if (search) {
      tasks = tasks.filter((task: Task) => task.title.includes(search) || task.description.includes(search) )
    }
    return tasks;
  }

  addTask(createTaskDto: CreateTaskDto): Task {
    const {title, description} = createTaskDto
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }

  getSingleTask(id: string): Task {
    if (!this.tasks) {
      return null
    }
    return this.tasks.find((task: Task) => task.id === id )
  }

  deleteSingleTask(id: string): void {
    if (!this.tasks) {
      return null;
    }
    this.tasks= this.tasks.filter((task: Task) => task.id !== id)
  }

  // updateTask(createTaskDto: CreateTaskDto, id: string): Task {
  //   const {title, description} = createTaskDto
  //   const task: Task = {
  //     id = this.tasks.indexOf(id).id,
  //
  //   }
  // }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getSingleTask(id);
    task.status = status;
    return task;
  }
}
