import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TeacherEntity} from "../entities/teacher.entity";
import {TeacherStudentEntity} from "../entities/teacher-student.entity";
import {StudentEntity} from "../entities/student.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TeacherEntity, TeacherStudentEntity, StudentEntity])],
  controllers: [TeacherController],
  providers: [TeacherService]
})
export class TeacherModule {}
