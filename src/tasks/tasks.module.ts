import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';

import { TasksController } from './tasks.controller';

import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskModel } from './task.model';

@Module({
  imports: [AuthModule],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TaskModel],
})
export class TasksModule {}
