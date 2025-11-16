import type { UUID } from 'crypto';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { UserGender } from '../../../shared/enums/user-gender.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

/** Users of the system, including doctors and patients */
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  /** First name of the user */
  @Column()
  name: string;

  /** Last name of the user */
  @Column()
  surname: string;

  /** Patronymic of the user */
  @Column({ type: 'varchar', length: 255, nullable: true })
  patronymic: string | null;

  /** Gender of the user */
  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  /** Birthdate of the user */
  @Column({ type: 'date' })
  birthDate: Date;

  /** Phone number of the user, must be unique and in E.164 format */
  @Column()
  phone: string;

  /** Hashed password of the user */
  @Column({ type: 'bytea' })
  password: Uint8Array;

  /** Salt used for hashing the password */
  @Column({ type: 'bytea' })
  passwordSalt: Uint8Array;

  /** Role of the user in the system */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  role: UserRole;

  /** Timestamp when the user registered */
  @Column({ type: 'timestamp' })
  registeredAt: Date;

  /** Timestamp of the user's last login */
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  /** Timestamp when the user was deleted, null if not deleted */
  @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  /** User who registered this user, null if self-registered */
  @RelationId((user: User) => user.registeredBy)
  registeredById: UUID | null;

  /** Many-to-one relationship to the user who registered this user */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'registeredById' })
  registeredBy: User | null;
}
