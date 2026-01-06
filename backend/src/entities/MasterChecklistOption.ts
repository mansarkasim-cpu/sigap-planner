import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MasterChecklistQuestion } from './MasterChecklistQuestion';

@Entity({ name: 'master_checklist_option' })
export class MasterChecklistOption {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => MasterChecklistQuestion)
  @JoinColumn({ name: 'question_id' })
  question?: MasterChecklistQuestion;

  @Column({ length: 255 })
  option_text!: string;

  @Column({ length: 255, nullable: true })
  option_value?: string;

  @Column({ name: 'order', type: 'int', default: 0 })
  order!: number;
}
