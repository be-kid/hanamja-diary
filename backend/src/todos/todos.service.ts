import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
  ) {}

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    const { date, content } = createTodoDto;
    const todo = this.todosRepository.create({ date, content, user });
    await this.todosRepository.save(todo);
    return todo;
  }

  async getTodosByDate(date: string, user: User): Promise<Todo[]> {
    return this.todosRepository.find({
      where: { date, user_id: user.id },
      order: { created_at: 'ASC' },
    });
  }

  async updateTodoCompletion(id: number, is_completed: boolean, user: User): Promise<Todo> {
    const todo = await this.todosRepository.findOneBy({ id, user_id: user.id });
    if (!todo) {
      throw new NotFoundException(`ID가 '${id}'인 할일을 찾을 수 없습니다.`);
    }
    todo.is_completed = is_completed;
    await this.todosRepository.save(todo);
    return todo;
  }

  async deleteTodo(id: number, user: User): Promise<void> {
    const result = await this.todosRepository.delete({ id, user_id: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`ID가 '${id}'인 할일을 찾을 수 없습니다.`);
    }
  }

  async getCompletionRate(date: string, user: User): Promise<number> {
    const todos = await this.todosRepository.find({
      where: { date, user_id: user.id },
    });

    if (todos.length === 0) {
      return 0;
    }

    const completedTodos = todos.filter(todo => todo.is_completed).length;
    return (completedTodos / todos.length) * 100;
  }

  async getMonthlyCompletionRates(year: number, month: number, user: User): Promise<{ date: string; rate: number }[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    const result = await this.todosRepository
      .createQueryBuilder('todo')
      .select('todo.date', 'date')
      .addSelect('COUNT(CASE WHEN todo.is_completed = TRUE THEN 1 ELSE NULL END)', 'completedCount')
      .addSelect('COUNT(todo.id)', 'totalCount')
      .where('todo.user_id = :userId', { userId: user.id })
      .andWhere('todo.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('todo.date')
      .orderBy('todo.date', 'ASC')
      .getRawMany();

    const rates = result.map(row => ({
      date: row.date,
      rate: row.totalCount === '0' ? 0 : (parseInt(row.completedCount) / parseInt(row.totalCount)) * 100,
    }));

    return rates;
  }
}
