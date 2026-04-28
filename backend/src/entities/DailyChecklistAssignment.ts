import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DailyChecklistSchedule } from './DailyChecklistSchedule';
import { MasterAlat } from './MasterAlat';
import { User } from './User';

/**
 * Satu baris assignment: asset X diassign ke teknisi Y dalam jadwal Z.
 * UNIQUE constraint (schedule_id, asset_id) memastikan satu asset hanya
 * diassign ke satu teknisi per hari.
 */
@Entity({ name: 'daily_checklist_assignment' })
export class DailyChecklistAssignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => DailyChecklistSchedule, s => s.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule!: DailyChecklistSchedule;

  @ManyToOne(() => MasterAlat)
  @JoinColumn({ name: 'asset_id' })
  asset!: MasterAlat;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /** PENDING | DONE | SKIPPED */
  @Column({ length: 20, default: 'PENDING' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  /** Diisi saat status menjadi DONE */
  @Column({ type: 'timestamptz', nullable: true, name: 'completed_at' })
  completedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
