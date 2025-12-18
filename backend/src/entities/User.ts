import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 200 })
  name!: string;

  @Column({ length: 200, unique: true, nullable: true })
  email?: string;

  @Column({ length: 15, unique: true, nullable: true })
  nipp?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ length: 50, default: "technician" })
  role!: string;

  @Column({ length: 100, nullable: true })
  site?: string;

  // @CreateDateColumn({ type: "timestamptz" })
  // createdAt!: Date;

  // @UpdateDateColumn({ type: "timestamptz" })
  // updatedAt!: Date;
}