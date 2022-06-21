import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TeacherStudentEntity} from "./teacher-student.entity";

@Entity('teachers')
export class TeacherEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => TeacherStudentEntity, teacherStudents => teacherStudents.teacher, {cascade: true})
    teacherStudents: TeacherStudentEntity[]
}
