import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

type MessageType = 'text' | 'image' | 'document' | 'report';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column('uuid')
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column('uuid')
  recipientId: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ['text', 'image', 'document', 'report'],
    default: 'text'
  })
  type: MessageType;

  @Column('boolean', { default: false })
  isRead: boolean;

  @Column('timestamp with time zone', { nullable: true })
  readAt?: Date;

  @Column('jsonb', { nullable: true })
  metadata?: {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    studyId?: string; // If related to a specific study
    appointmentId?: string; // If related to a specific appointment
  };

  @CreateDateColumn()
  createdAt: Date;
}
