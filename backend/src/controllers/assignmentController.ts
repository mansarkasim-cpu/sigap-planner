import { IsUUID, IsNotEmpty, IsOptional, IsISO8601 } from "class-validator";

export class AssignmentCreateDTO {
  @IsUUID()
  @IsNotEmpty()
  woId!: string;

  @IsUUID()
  @IsNotEmpty()
  assigneeId!: string;

  @IsUUID()
  @IsOptional()
  assignedBy?: string;

  @IsISO8601()
  @IsOptional()
  scheduledAt?: string;
}