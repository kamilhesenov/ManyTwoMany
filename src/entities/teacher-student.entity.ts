import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TeacherEntity} from "./teacher.entity";
import {StudentEntity} from "./student.entity";

@Entity('teacher_students')
export class TeacherStudentEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    teacherId: number;

    @Column()
    studentId: number;

    @ManyToOne(type => TeacherEntity, teacher => teacher.teacherStudents, {onDelete: "CASCADE"})
    teacher: TeacherEntity;

    @ManyToOne(type => StudentEntity, student => student.teacherStudents, {onDelete: "CASCADE"})
    student: StudentEntity;
}
