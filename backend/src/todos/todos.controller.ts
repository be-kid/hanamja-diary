import { Controller, Post, Get, Body, Param, Patch, Delete, UseGuards, ValidationPipe, Query } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('todos')
@UseGuards(AuthGuard())
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  createTodo(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @GetUser() user: User,
  ): Promise<any> {
    return this.todosService.createTodo(createTodoDto, user);
  }

  @Get('/monthly-completion-rates')
  getMonthlyCompletionRates(
    @Query('year') year: number,
    @Query('month') month: number,
    @GetUser() user: User,
  ): Promise<any[]> {
    return this.todosService.getMonthlyCompletionRates(year, month, user);
  }

  @Get('/overall-monthly-completion-rate')
  getOverallMonthlyCompletionRate(
    @Query('year') year: number,
    @Query('month') month: number,
    @GetUser() user: User,
  ): Promise<number> {
    return this.todosService.getOverallMonthlyCompletionRate(year, month, user);
  }

  @Get('/completion-rate/:date')
  getCompletionRate(
    @Param('date') date: string,
    @GetUser() user: User,
  ): Promise<number> {
    return this.todosService.getCompletionRate(date, user);
  }

  @Get('/:date')
  getTodosByDate(
    @Param('date') date: string,
    @GetUser() user: User,
  ): Promise<any[]> {
    return this.todosService.getTodosByDate(date, user);
  }

  @Patch('/:id/complete')
  updateTodoCompletion(
    @Param('id') id: number,
    @Body('is_completed') is_completed: boolean,
    @GetUser() user: User,
  ): Promise<any> {
    return this.todosService.updateTodoCompletion(id, is_completed, user);
  }

  @Delete('/:id')
  deleteTodo(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.todosService.deleteTodo(id, user);
  }
}
