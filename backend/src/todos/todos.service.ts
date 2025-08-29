import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../users/user.entity';
import { Todo } from './todo.entity';
import { TodosRepository } from './todos.repository';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    return this.todosRepository.createTodo(createTodoDto, user);
  }

  async getTodosByDate(date: string, user: User): Promise<Todo[]> {
    return this.todosRepository.getTodosByDate(date, user);
  }

  async updateTodoCompletion(
    id: number,
    is_completed: boolean,
    user: User,
  ): Promise<Todo> {
    const todo = await this.todosRepository.findOneById(id, user.id);
    if (!todo) {
      throw new NotFoundException(`ID가 '${id}'인 할일을 찾을 수 없습니다.`);
    }
    todo.is_completed = is_completed;
    return this.todosRepository.save(todo);
  }

  async deleteTodo(id: number, user: User): Promise<void> {
    const affected = await this.todosRepository.deleteTodo(id, user);
    if (affected === 0) {
      throw new NotFoundException(`ID가 '${id}'인 할일을 찾을 수 없습니다.`);
    }
  }

  async getCompletionRate(date: string, user: User): Promise<number> {
    const todos = await this.todosRepository.findByDate(date, user.id);

    if (todos.length === 0) {
      return 0;
    }

    const completedTodos = todos.filter(todo => todo.is_completed).length;
    return (completedTodos / todos.length) * 100;
  }

  async getMonthlyCompletionRates(
    year: number,
    month: number,
    user: User,
  ): Promise<{ date: string; rate: number }[]> {
    return this.todosRepository.getMonthlyCompletionRates(year, month, user);
  }

  async getOverallMonthlyCompletionRate(year: number, month: number, user: User): Promise<number> {
    return this.todosRepository.getOverallMonthlyCompletionRate(year, month, user);
  }
}
