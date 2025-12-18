import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WorkOrder } from './WorkOrder';
import { TaskAssignment } from './TaskAssignment';

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => WorkOrder)
  @JoinColumn({ name: 'work_order_id' })
  workOrder?: WorkOrder;

  @Column({ length: 200, nullable: true })
  external_id?: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'int', nullable: true })
  duration_min?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, default: 'NEW' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => TaskAssignment, a => a.task)
  assignments?: TaskAssignment[];
}
