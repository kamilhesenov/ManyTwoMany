import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import {ApiTags} from "@nestjs/swagger";
import {TeacherDto} from "./dto/teacher.dto";
import {TeacherEntity} from "../entities/teacher.entity";

@ApiTags('teacher')
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  createTeacher(@Body() teacherDto: TeacherDto): Promise<TeacherEntity>{
    return this.teacherService.create(teacherDto);
  }

  @Get()
  getAllTeachers(): Promise<TeacherEntity[]>{
    return this.teacherService.findAllTeachers();
  }

  @Get(':id')
  getTeacherById(@Param('id', ParseIntPipe) id: number): Promise<TeacherEntity>{
    return this.teacherService.findTeacherById(id);
  }

  @Put(':id')
  updateTeacher(@Param('id', ParseIntPipe) id: number, @Body() teacherDto: TeacherDto): Promise<string>{
    return this.teacherService.update(id, teacherDto);
  }

  @Delete(':id')
  deleteTeacher(@Param('id', ParseIntPipe) id: number): Promise<string>{
    return this.teacherService.delete(id);
  }
}
