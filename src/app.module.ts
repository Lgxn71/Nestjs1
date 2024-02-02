import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TasksModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}

// ! Regenereate keys
//  marshall eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Im1hcnNoYWxsIiwiaWF0IjoxNzA2NzcxOTI3LCJleHAiOjE3MDY3NzU1Mjd9.vIl7wYxHQGcxJq7inEQjW_TI0ws9DN8sm2RjFFD9pJs
//  user2 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InVzZXIyIiwiaWF0IjoxNzA2NzcxOTA0LCJleHAiOjE3MDY3NzU1MDR9.PQR0M6B-a95xWhIB7Wz4eSW0HF-QkNXr_hN7PApUBQc
