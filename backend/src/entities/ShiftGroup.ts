import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'shift_group' })
export class ShiftGroup {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 200 })
  name!: string;

  // store members as JSON array of user ids
  @Column({ type: 'jsonb', nullable: true })
  members?: string[];

  @Column({ length: 200, nullable: true })
  site?: string;

  // optional leader id (references a user id)
  @Column({ length: 200, nullable: true })
  leader?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
