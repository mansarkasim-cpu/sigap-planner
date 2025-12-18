import { IsUUID, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RealisasiCreateDTO {
  @IsUUID()
  @IsNotEmpty()
  assignmentId!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  // base64 image or file key provided by client
  @IsString()
  @IsOptional()
  photoBase64?: string;

  @IsString()
  @IsOptional()
  signatureBase64?: string;

  @IsOptional()
  startTime?: string;

  @IsOptional()
  endTime?: string;

  @IsOptional()
  result?: any;
}