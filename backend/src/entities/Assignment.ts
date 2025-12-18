import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { WorkOrder } from "./WorkOrder";
import { User } from "./User";
import { Realisasi } from "./Realisasi";

@Entity({ name: "assignment" })
export class Assignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => WorkOrder, (wo: { assignments: any; }) => wo.assignments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "wo_id" })
  wo!: WorkOrder;

  @Column({ name: 'assignee_id', type: "uuid", nullable: true })
  assigneeId?: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  task_id?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  task_name?: string;

  @Column({ name: 'assigned_by', type: "uuid", nullable: true })
  assignedBy?: string;

  @Column({ name: 'scheduled_at', type: "timestamptz", nullable: true })
  scheduledAt?: Date;

  @Column({ length: 50, default: "ASSIGNED" })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt?: Date | null;

  @OneToMany(() => Realisasi, (r: { assignment: any; }) => r.assignment)
  realisasi!: Realisasi[];
}