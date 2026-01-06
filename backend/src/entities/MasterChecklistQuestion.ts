import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MasterJenisAlat } from './MasterJenisAlat';
import { MasterChecklistOption } from './MasterChecklistOption';

@Entity({ name: 'master_checklist_question' })
export class MasterChecklistQuestion {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => MasterJenisAlat)
  @JoinColumn({ name: 'jenis_alat_id' })
  jenis_alat?: MasterJenisAlat;

  @Column({ type: 'text' })
  question_text!: string;

  @Column({ length: 32, default: 'boolean' })
  input_type!: string;

  @Column({ default: true })
  required!: boolean;

  @Column({ name: 'order', type: 'int', default: 0 })
  order!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updated_at!: Date;

  @OneToMany(() => MasterChecklistOption, (opt) => opt.question)
  options?: MasterChecklistOption[];
}
