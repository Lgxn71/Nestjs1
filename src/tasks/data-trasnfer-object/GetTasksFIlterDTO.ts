import { TaskStatus } from '../task.model';

import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn(['IN_PROGRESS', 'OPEN', 'DONE'])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
