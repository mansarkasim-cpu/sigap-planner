import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'master_jenis_alat' })
export class MasterJenisAlat {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 255, unique: true })
  nama!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'numeric', name: 'avg_hours_per_day', nullable: true, default: 24 })
  avg_hours_per_day?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
