import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('studies')
export class Study {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.studies)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column('uuid')
  patientId: string;

  @Column({ unique: true })
  studyUid: string; // DICOM Study Instance UID

  @Column('date', { nullable: true })
  studyDate?: Date;

  @Column({ nullable: true })
  modality?: string; // CT, MR, XR, etc.

  @Column('text', { nullable: true })
  description?: string;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>; // Additional DICOM metadata

  @Column('boolean', { default: false })
  isReported: boolean;

  @Column('text', { nullable: true })
  report?: string;

  @Column('uuid', { nullable: true })
  reportedById?: string; // ID of the radiologist who reported the study

  @Column('timestamp with time zone', { nullable: true })
  reportedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp with time zone', { nullable: true })
  updatedAt?: Date;
}
