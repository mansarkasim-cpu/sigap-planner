import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MasterSite } from './MasterSite';
import { User } from './User';
import { DailyChecklistAssignment } from './DailyChecklistAssignment';

/**
 * Satu jadwal harian per (tanggal, site).
 * Berisi sekumpulan DailyChecklistAssignment (asset → teknisi).
 */
@Entity({ name: 'daily_checklist_schedule' })
export class DailyChecklistSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Tanggal jadwal (YYYY-MM-DD) */
  @Column({ type: 'date' })
  date!: string;

  @ManyToOne(() => MasterSite, { nullable: true })
  @JoinColumn({ name: 'site_id' })
  site?: MasterSite;

  /** PUBLISHED | DONE */
  @Column({ length: 20, default: 'PUBLISHED' })
  status!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToMany(() => DailyChecklistAssignment, a => a.schedule, { cascade: true })
  assignments?: DailyChecklistAssignment[];
}
