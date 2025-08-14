import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  nickname: string;

  @Column({ nullable: false })
  password_hash: string;

  @Column({ type: 'enum', enum: ['남자', '여자'], nullable: false })
  gender: '남자' | '여자';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
