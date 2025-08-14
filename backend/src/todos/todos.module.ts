import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
