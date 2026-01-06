import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { DailyChecklist } from './DailyChecklist';
import { MasterChecklistQuestion } from './MasterChecklistQuestion';
import { MasterChecklistOption } from './MasterChecklistOption';

@Entity({ name: 'daily_checklist_item' })
export class DailyChecklistItem {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => DailyChecklist)
  @JoinColumn({ name: 'daily_checklist_id' })
  daily_checklist?: DailyChecklist;

  @ManyToOne(() => MasterChecklistQuestion)
  @JoinColumn({ name: 'question_id' })
  question?: MasterChecklistQuestion;

  @ManyToOne(() => MasterChecklistOption, { nullable: true })
  @JoinColumn({ name: 'option_id' })
  option?: MasterChecklistOption;

  @Column({ type: 'text', nullable: true })
  answer_text?: string;

  @Column({ type: 'numeric', nullable: true })
  answer_number?: number;

  @Column({ type: 'text', nullable: true })
  evidence_photo_url?: string;

  @Column({ type: 'text', nullable: true })
  evidence_photo_path?: string;

  @Column({ type: 'text', nullable: true })
  evidence_note?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  created_at!: Date;
}
