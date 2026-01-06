import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MasterAlat } from './MasterAlat';
import { MasterSite } from './MasterSite';

@Entity({ name: 'daily_checklist' })
export class DailyChecklist {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => MasterAlat)
  @JoinColumn({ name: 'alat_id' })
  alat?: MasterAlat;

  @Column({ type: 'bigint' })
  teknisi_id!: number;

  @Column({ length: 255, nullable: true })
  teknisi_name?: string;

  @Column({ type: 'timestamptz', name: 'performed_at', nullable: false })
  performed_at!: Date;

  @Column({ type: 'double precision', nullable: true })
  latitude?: number;

  @Column({ type: 'double precision', nullable: true })
  longitude?: number;

  @ManyToOne(() => MasterSite, { nullable: true })
  @JoinColumn({ name: 'site_id' })
  site?: MasterSite;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
