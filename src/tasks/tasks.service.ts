import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { TaskModel, TaskStatus } from './task.model';

import { CreateTaskDTO } from './data-trasnfer-object/CreateTaskDTO';
import { GetTasksFilterDTO } from './data-trasnfer-object/GetTasksFIlterDTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { Task, User } from '@prisma/client';
@Injectable()
export class TasksService {
  private logger = new Logger();

  constructor(
    private readonly prisma: PrismaService,
    private readonly taskModel: TaskModel,
  ) {}

  public async getTasks(filterDTO: GetTasksFilterDTO, user: User) {
    try {
      return await this.taskModel.getTasks(filterDTO, user);
    } catch (error) {
      this.handleServiceError('Could not get tasks', error);
    }
  }

  public async getTaskById(id: string, userId: string): Promise<Task> {
    try {
      const foundTask = await this.prisma.task.findUniqueOrThrow({
        where: { id, userId },
      });
      this.logger.log('Task found', foundTask);
      return foundTask;
    } catch (error) {
      this.handleServiceError(`Task with ${id} not found or not exist`, error);
    }
  }

  public async createTask(createTaskDTO: CreateTaskDTO, user: User) {
    try {
      return await this.taskModel.createTask(createTaskDTO, user);
    } catch (error) {
      this.handleServiceError('Error creating task', error);
    }
  }

  public async deleteTaskById(id: string, userId: string): Promise<void> {
    const foundTask = await this.getTaskById(id, userId);
    if (foundTask) {
      await this.prisma.task.delete({ where: { id, userId } });
      this.logger.log('Task deleted', foundTask);
    }
  }

  public async updateTaskStatusById(
    id: string,
    status: TaskStatus,
    userId: string,
  ): Promise<Task> {
    const foundTask = await this.getTaskById(id, userId);
    foundTask.status = status;

    try {
      await this.prisma.task.update({
        where: { id, userId },
        data: { status },
      });
      return foundTask;
    } catch (error) {
      this.handleServiceError('Error updating task status', error);
    }
  }
  private handleServiceError(message: string, error: any) {
    this.logger.error(message, error.stack);
    throw new NotFoundException(message); // 404 error
  }
}
