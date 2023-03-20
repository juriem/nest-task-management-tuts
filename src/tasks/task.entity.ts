import { Column, Entity, PrimaryGeneratedColumn, Repository } from "typeorm";
import { TaskStatus } from "./task-status.enum";

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: TaskStatus;
}