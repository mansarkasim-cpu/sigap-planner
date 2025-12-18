import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Task } from './Task';
import { User } from './User';

@Entity({ name: 'task_assignment' })
export class TaskAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task?: Task;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'assigned_by', length: 200, nullable: true })
  assignedBy?: string;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamptz' })
  assignedAt!: Date;
}
