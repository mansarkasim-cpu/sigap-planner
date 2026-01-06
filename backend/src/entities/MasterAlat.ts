import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MasterJenisAlat } from './MasterJenisAlat';
import { MasterSite } from './MasterSite';

@Entity({ name: 'master_alat' })
export class MasterAlat {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 255 })
  nama!: string;

  @Column({ length: 128, nullable: true })
  kode?: string;

  @Column({ length: 128, nullable: true })
  serial_no?: string;

  @ManyToOne(() => MasterJenisAlat)
  @JoinColumn({ name: 'jenis_alat_id' })
  jenis_alat?: MasterJenisAlat;

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
