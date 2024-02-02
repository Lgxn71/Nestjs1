import {
  Body,
  Param,
  Query,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

import { TaskStatus } from './task.model';

import { GetTasksFilterDTO } from './data-trasnfer-object/GetTasksFIlterDTO';

import { CreateTaskDTO } from './data-trasnfer-object/CreateTaskDTO';
import { TaskStatusValidationPipe } from './pipes/TaskStatusValidation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe)
    filterDTO: GetTasksFilterDTO,
    @GetUser()
    user: User,
  ) {
    return this.taskService.getTasks(filterDTO, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.getTaskById(id, user.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO, @GetUser() user: User) {
    return this.taskService.createTask(createTaskDTO, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.taskService.deleteTaskById(id, user.id);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ) {
    return this.taskService.updateTaskStatusById(id, status, user.id);
  }
}
