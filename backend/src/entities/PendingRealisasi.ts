import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Task } from "./Task";

@Entity({ name: 'pending_realisasi' })
export class PendingRealisasi {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Task, (t) => t.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ name: 'photo_url', type: 'varchar', length: 1000, nullable: true })
  photoUrl?: string | null;

  @Column({ name: 'photo_urls', type: 'jsonb', nullable: true })
  photoUrls?: string[] | null;

  @Column({ name: 'signature_url', type: 'varchar', length: 1000, nullable: true })
  signatureUrl?: string | null;

  @Column({ name: 'submitter_id', type: 'uuid', nullable: true })
  submitterId?: string | null;

  @CreateDateColumn({ name: 'submitted_at', type: 'timestamptz' })
  submittedAt!: Date;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status!: string;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy?: string | null;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt?: Date | null;

  @Column({ name: 'start_time', type: 'timestamptz', nullable: true })
  startTime?: Date | null;

  @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
  endTime?: Date | null;
}
