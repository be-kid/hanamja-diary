import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  date: string; // YYYY-MM-DD 형식

  @Column({ nullable: false })
  content: string;

  @Column({ default: false })
  is_completed: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // User 삭제 시 Todo도 삭제
  @JoinColumn({ name: 'user_id' }) // 외래키 컬럼명 지정
  user: User;

  @Column({ name: 'user_id' }) // user_id 컬럼을 직접 정의
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
