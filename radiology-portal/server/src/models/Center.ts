import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Appointment } from './Appointment';

type WorkingHours = {
  [key: string]: {
    open: string;
    close: string;
  };
};

@Entity('centers')
export class Center {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({ default: 'Tunisia' })
  country: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column('point', { nullable: true })
  coordinates?: { x: number; y: number };

  @Column('jsonb', { nullable: true })
  workingHours?: WorkingHours;

  @Column('text', { nullable: true })
  description?: string;

  @OneToMany(() => Appointment, appointment => appointment.center)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;
}
