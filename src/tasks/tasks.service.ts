import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from "./task.model";
import { v4 as uuid } from "uuid";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }
    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title: title,
      description: description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((v) => v.id === id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  deleteTaskById(id: string): Task[] {
    let found = false;
    this.tasks = this.tasks.filter((v) => {
      if (v.id === id) {
        found = true;
      }
      return v.id !== id;
    });
    if (!found) {
      throw new NotFoundException();
    }
    return this.tasks;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    this.tasks = this.tasks.map((task) => {
      if (task.id === id) {
        return { ...task, status: status };
      }
      return task;
    });
    return this.tasks.find((task) => task.id === id);
  }
}
