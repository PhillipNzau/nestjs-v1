import { Injectable, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./tasks-status.model";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";


@Injectable()

export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {
  }

  /////////////////
  // Get all tasks
  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder("task");

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere(
        "LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)", { search: `%${search}%` });
    }
    return await query.getMany();
  }

  // /////////////////
  // Add task
  async addTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN
    });

    await this.taskRepository.save(task);

    return task;
  }

  // /////////////////
  // Get task by id
  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  /////////////////
  // Delete task by ID
  async deleteTaskById(id: string): Promise<void> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  /////////////////
  // Updated task status by id
  async updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {

    const task = await this.getTaskById(id);
    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }
}
