import { PrismaService } from 'src/prisma/prisma.service';
import { Task, User } from '@prisma/client';
import { CreateTaskDTO } from './data-trasnfer-object/CreateTaskDTO';
import { nanoid } from 'nanoid';
import { GetTasksFilterDTO } from './data-trasnfer-object/GetTasksFIlterDTO';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TaskModel {
  private logger = new Logger('TaskModel');

  constructor(private readonly prisma: PrismaService) {}

  public async getTasks(
    filterDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDTO;
    const tasks = await this.prisma.task.findMany({
      where: {
        ...(user.id && { userId: user.id }),
        ...(status && { status }),
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
    });

    this.logger.log('Tasks were found: ', tasks);
    return tasks;
  }

  public async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskDTO;

    const newTask = await this.prisma.task.create({
      data: {
        userId: user.id,
        id: nanoid(),
        title,
        description,
      },
    });

    this.logger.log('task created', newTask);

    return newTask;
  }
}

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';
