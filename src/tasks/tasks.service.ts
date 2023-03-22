import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { use } from 'passport';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.andWhere({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :s OR LOWER(task.description) LIKE :s)',
        { s: `%${search.toLowerCase()}%` }
      );
    }
    return await query.getMany();
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: id,
        user,
      },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user,
    });
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id: id,
      user: user,
    });
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    return this.taskRepository.save(task);
  }
}
