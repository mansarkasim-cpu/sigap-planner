import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Assignment } from "./Assignment";

@Entity({ name: "realisasi" })
export class Realisasi {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Assignment, (a) => a.realisasi, { onDelete: "CASCADE" })
  @JoinColumn({ name: "assignment_id" })
  assignment!: Assignment;

  @Column({ type: "text", nullable: true })
  notes?: string | null;

  @Column({ name: 'photo_url', type: "varchar", length: 1000, nullable: true })
  photoUrl?: string | null;

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