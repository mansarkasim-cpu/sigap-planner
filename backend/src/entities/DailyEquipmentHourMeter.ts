import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MasterAlat } from './MasterAlat';
import { MasterJenisAlat } from './MasterJenisAlat';
import { MasterSite } from './MasterSite';
import { User } from './User';

@Entity({ name: 'daily_equipment_hour_meter' })
export class DailyEquipmentHourMeter {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => MasterAlat)
  @JoinColumn({ name: 'alat_id' })
  alat?: MasterAlat;

  @ManyToOne(() => MasterJenisAlat)
  @JoinColumn({ name: 'jenis_alat_id' })
  jenis_alat?: MasterJenisAlat;

  @ManyToOne(() => MasterSite)
  @JoinColumn({ name: 'site_id' })
  site?: MasterSite;

  @Column({ type: 'numeric', nullable: true })
  engine_hour?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teknisi_id' })
  teknisi?: User;

  @Column({ type: 'timestamptz', name: 'recorded_at', nullable: false })
  recorded_at!: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
