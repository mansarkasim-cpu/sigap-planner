import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkOrder } from './WorkOrder';

@Entity({ name: 'work_order_date_history' })
export class WorkOrderDateHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'work_order_id' })
  work_order_id!: string;

  @ManyToOne(() => WorkOrder, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'work_order_id' })
  workOrder?: WorkOrder;

  @Column({ type: 'timestamptz', nullable: true })
  old_start?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  old_end?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  new_start?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  new_end?: Date;

  @Column({ type: 'text', nullable: true })
  note?: string;

  // store minimal changed_by info (id, email, name) as JSONB
  @Column({ type: 'jsonb', nullable: true })
  changed_by?: any;

  @CreateDateColumn({ name: 'changed_at' })
  changed_at!: Date;
}
