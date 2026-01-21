import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MasterHub } from './MasterHub';

@Entity({ name: 'master_site' })
export class MasterSite {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ length: 64, nullable: true, unique: true })
  code?: string;

  @Column({ length: 255 })
  name!: string;

  @ManyToOne(() => MasterHub, { nullable: true })
  @JoinColumn({ name: 'hub_id' })
  hub?: MasterHub;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ length: 64, nullable: true })
  timezone?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;
}
