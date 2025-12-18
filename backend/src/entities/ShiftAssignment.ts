import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ShiftGroup } from './ShiftGroup';

@Entity({ name: 'shift_assignment' })
export class ShiftAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // date in YYYY-MM-DD
  @Column({ length: 20 })
  date!: string;

  @Column({ type: 'int' })
  shift!: number;

  @ManyToOne(() => ShiftGroup)
  @JoinColumn({ name: 'group_id' })
  group?: ShiftGroup;

  @Column({ length: 200, nullable: true })
  site?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
