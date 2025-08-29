import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TodosRepository {
  constructor(
    @InjectRepository(Todo) private readonly repository: Repository<Todo>,
  ) {}

  async createTodo(createTodoDto: CreateTodoDto, user: User): Promise<Todo> {
    const { date, content } = createTodoDto;
    const todo = this.repository.create({ date, content, user });
    await this.repository.save(todo);
    return todo;
  }

  async getTodosByDate(date: string, user: User): Promise<Todo[]> {
    return this.repository.find({
      where: { date, user_id: user.id },
      order: { created_at: 'ASC' },
    });
  }

  async findOneById(id: number, userId: number): Promise<Todo | null> {
    return this.repository.findOneBy({ id, user_id: userId });
  }

  async save(todo: Todo): Promise<Todo> {
    return this.repository.save(todo);
  }

  async deleteTodo(id: number, user: User): Promise<number | undefined | null> {
    const result = await this.repository.delete({ id, user_id: user.id });
    return result.affected;
  }

  async findByDate(date: string, userId: number): Promise<Todo[]> {
    return this.repository.find({
      where: { date, user_id: userId },
    });
  }

  async getMonthlyCompletionRates(year: number, month: number, user: User): Promise<{ date: string; rate: number }[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    const result = await this.repository
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