import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {StudentEntity} from "../entities/student.entity";
import {TeacherStudentEntity} from "../entities/teacher-student.entity";
import {TeacherEntity} from "../entities/teacher.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity, TeacherStudentEntity, TeacherEntity])],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
