import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { TaskStatus } from "./tasks-status.model";
import { CreateTaskDto } from "./dto/create-task-dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { Repository } from "typeorm";
import { User } from "../auth/user.entity";


@Injectable()

export class TasksService {
  private logger = new Logger('TaskService')
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {
  }

  /////////////////
  // Get all tasks
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder("task");
    query.where({user});

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere(
        "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))", { search: `%${search}%` });
    } try
    {
      return await query.getMany();
    } catch (error) {
      this.logger.error(`Failed to get tasks for ${user.username} filters ${JSON.stringify(filterDto)}`, error.stack)
      throw new InternalServerErrorException();
    }
  }

  // /////////////////
  // Add task
  async addTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.taskRepository.save(task);

    return task;
  }

  // /////////////////
  // Get task by id
  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id, user });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  /////////////////
  // Delete task by ID
  async deleteTaskById(id: string, user:User): Promise<void> {
    const result = await this.taskRepository.delete({ id, user});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  /////////////////
  // Updated task status by id
  async updateTaskStatusById(id: string, status: TaskStatus, user: User): Promise<Task> {

    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.taskRepository.save(task);

    return task;
  }
}
