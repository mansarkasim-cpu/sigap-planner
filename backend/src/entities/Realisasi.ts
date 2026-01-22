import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./Task";

@Entity({ name: "realisasi" })
export class Realisasi {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Task, (t) => t.assignments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Column({ name: 'photo_url', type: "varchar", length: 1000, nullable: true })
  photoUrl?: string | null;

  @Column({ name: 'photo_urls', type: 'jsonb', nullable: true })
  photoUrls?: string[] | null;

  @Column({ name: 'signature_url', type: "varchar", length: 1000, nullable: true })
  signatureUrl?: string | null;

  @Column({ type: "jsonb", nullable: true })
  result?: any;

  @Column({ name: 'start_time', type: 'timestamptz', nullable: true })
  startTime?: Date | null;

  @Column({ name: 'end_time', type: 'timestamptz', nullable: true })
  endTime?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: "timestamptz" })
  createdAt!: Date;
}