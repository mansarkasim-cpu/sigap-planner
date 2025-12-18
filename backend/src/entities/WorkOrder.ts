// src/entities/WorkOrder.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'work_order' })
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // nomor dokumen/nomor WO dari SIGAP (doc_no field)
  @Column({ nullable: true, unique: true })
  doc_no?: string;

  // original SIGAP numeric id
  @Column({ nullable: true })
  sigap_id?: number;

  @Column({ nullable: true })
  date_doc?: string; // simpan string ISO atau original format

  @Column({ nullable: true })
  asset_id?: number;

  @Column({ nullable: true })
  asset_name?: string;

  @Column({ nullable: true })
  type_work?: string;

  @Column({ nullable: true })
  work_type?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  start_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date?: Date;

  // original raw payload
  @Column({ type: 'jsonb', nullable: true })
  raw?: any;

  @Column({ length: 50, default: 'NEW' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  // @UpdateDateColumn({ name: 'updated_at' })
  // updated_at!: Date;
}
