import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { StudentService } from './student.service';
import {StudentDto} from "./dto/student.dto";
import {StudentEntity} from "../entities/student.entity";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  createStudent(@Body() studentDto: StudentDto): Promise<StudentEntity>{
    return this.studentService.create(studentDto);
  }

  @Get()
  getAllStudents(): Promise<StudentEntity[]>{
    return this.studentService.findAllStudents();
  }

  @Get(':id')
  getStudentById(@Param('id', ParseIntPipe) id: number): Promise<StudentEntity>{
    return this.studentService.findStudentById(id);
  }

  @Put(':id')
  updateStudent(@Param('id', ParseIntPipe) id: number, @Body() studentDto: StudentDto): Promise<string>{
    return this.studentService.update(id, studentDto);
  }

  @Delete(':id')
  deleteStudent(@Param('id', ParseIntPipe) id: number): Promise<string>{
    return this.studentService.delete(id);
  }
}
