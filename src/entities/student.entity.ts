import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {TeacherStudentEntity} from "./teacher-student.entity";

@Entity('students')
export class StudentEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => TeacherStudentEntity, teacherStudents => teacherStudents.student, {cascade: true})
    teacherStudents: TeacherStudentEntity[]
}
