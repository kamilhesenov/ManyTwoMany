import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TeacherEntity} from "../entities/teacher.entity";
import {Repository} from "typeorm";
import {StudentEntity} from "../entities/student.entity";
import {TeacherStudentEntity} from "../entities/teacher-student.entity";
import {TeacherDto} from "./dto/teacher.dto";

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(TeacherEntity)
        private readonly teacherRepository: Repository<TeacherEntity>,
        @InjectRepository(TeacherStudentEntity)
        private readonly teacherStudentRepository: Repository<TeacherStudentEntity>,
        @InjectRepository(StudentEntity)
        private readonly studentRepository: Repository<StudentEntity>
    ) {}

    async create(teacherDto: TeacherDto): Promise<TeacherEntity>{
        const teacher = new TeacherEntity();
        teacher.name = teacherDto.name;
        await this.teacherRepository.save(teacher);

        if(teacherDto.studentIds && teacherDto.studentIds.length > 0){
            const students = await this.studentRepository
                .createQueryBuilder('student')
                .where('student.id IN (:...id)', {
                    id: teacherDto.studentIds.map((id)=> id),
                }).getMany();

            students.map(async (item) =>{
                const teacherStudents = new TeacherStudentEntity();
                teacherStudents.teacher = teacher;
                teacherStudents.student = item;
                await this.teacherStudentRepository.save(teacherStudents);
            })
        }
        return teacher;
    }

    async findAllTeachers(): Promise<TeacherEntity[]>{
        return await this.teacherRepository
            .createQueryBuilder('teacher')
            .leftJoinAndSelect('teacher.teacherStudents', 'teacherStudents')
            .leftJoinAndSelect('teacherStudents.student', 'student')
            .getMany();
    }

    async findTeacherById(id: number): Promise<TeacherEntity>{
        const teacher = await this.teacherRepository
            .createQueryBuilder('teacher')
            .where('teacher.id = :id', {id})
            .leftJoinAndSelect('teacher.teacherStudents', 'teacherStudents')
            .leftJoinAndSelect('teacherStudents.student', 'student')
            .getOne();

        if(!teacher) throw new NotFoundException(`Teacher with "${id}" id Not Found`);
        return teacher;
    }

    async update(id: number, teacherDto: TeacherDto): Promise<string>{
        const teacher = await this.teacherRepository
            .createQueryBuilder('teacher')
            .where('teacher.id = :id', {id})
            .leftJoinAndSelect('teacher.teacherStudents', 'teacherStudents')
            .getOne();
        if(!teacher) throw new NotFoundException(`Teacher with "${id}" id Not Found`);
        teacher.name = teacherDto.name;

        if(teacher.teacherStudents && teacher.teacherStudents.length > 0){
            const teacherStudents = await this.teacherStudentRepository
                .createQueryBuilder('teacher_student')
                .where('teacher_student.id IN (:...id)', {
                    id: teacher.teacherStudents.map(stu => stu.id)
                }).getMany();
            await this.teacherStudentRepository.remove(teacherStudents);
        }

        if(teacherDto.studentIds && teacherDto.studentIds.length > 0){
            const students = await this.studentRepository
                .createQueryBuilder('student')
                .where('student.id IN (:...id)', {
                    id: teacherDto.studentIds.map((id) => id),
                }).getMany();

            students.map(async (item)=>{
                const teacherStudents = new TeacherStudentEntity();
                teacherStudents.teacher = teacher;
                teacherStudents.student = item;
                await this.teacherStudentRepository.save(teacherStudents);
            })
        }
        return `Teacher with ${id} id updated`;
    }

    async delete(id: number): Promise<string>{
        const teacher = await this.teacherRepository.findOne({where: {id}});
        if(!teacher) throw new NotFoundException(`Teacher with "${id}" id Not Found`);
        await this.teacherRepository.remove(teacher);

        return `Teacher with ${id} id deleted`;
    }
}
