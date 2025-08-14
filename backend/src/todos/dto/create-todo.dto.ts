import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  content: string;
}
