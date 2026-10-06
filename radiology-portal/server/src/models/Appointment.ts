import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Center } from './Center';

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'in_progress';

type StudyType = 'xray' | 'ct' | 'mri' | 'ultrasound' | 'mammography' | 'other';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column('uuid')
  patientId: string;

  @ManyToOne(() => Center, center => center.appointments)
  @JoinColumn({ name: 'centerId' })
  center: Center;

  @Column('uuid')
  centerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'doctorId' })
  doctor?: User;

  @Column('uuid', { nullable: true })
  doctorId?: string;

  @Column('timestamp with time zone')
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: ['scheduled', 'completed', 'cancelled', 'in_progress'],
    default: 'scheduled'
  })
  status: AppointmentStatus;

  @Column('text', { nullable: true })
  notes?: string;

  @Column({
    type: 'enum',
    enum: ['xray', 'ct', 'mri', 'ultrasound', 'mammography', 'other'],
    nullable: true
  })
  studyType?: StudyType;

  @Column('text', { nullable: true })
  studyDescription?: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamp with time zone', { nullable: true })
  completedAt?: Date;
}
