import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task, TaskStatus } from "./task.model";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { fromInteropObservable } from "rxjs/internal/observable/innerFrom";
import { UpdateTaskStatusDto } from "./dto/update-task-status.dto";

@Controller("tasks")
export class TasksController {
  constructor(private readonly service: TasksService) {
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.service.getTaskWithFilter(filterDto);
    } else {
      return this.service.getAllTasks();
    }
  }

  @Get("/:id")
  getTaskById(@Param("id") id: string): Task {
    return this.service.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.service.createTask(createTaskDto);
  }

  @Delete("/:id")
  deleteTaskById(@Param("id") id: string): Task[] {
    return this.service.deleteTaskById(id);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id") id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const { status } = updateTaskStatusDto;
    return this.service.updateTaskStatus(id, status);
  }
}
