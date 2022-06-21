import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {StudentEntity} from "../entities/student.entity";
import {Repository} from "typeorm";
import {TeacherStudentEntity} from "../entities/teacher-student.entity";
import {TeacherEntity} from "../entities/teacher.entity";
import {StudentDto} from "./dto/student.dto";

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(StudentEntity)
        private readonly studentRepository: Repository<StudentEntity>,
        @InjectRepository(TeacherStudentEntity)
        private readonly teacherStudentRepository: Repository<TeacherStudentEntity>,
        @InjectRepository(TeacherEntity)
        private readonly teacherRepository: Repository<TeacherEntity>
    ) {}

    async create(studentDto: StudentDto): Promise<StudentEntity>{
        const student = new StudentEntity();
        student.name = studentDto.name;
        await this.studentRepository.save(student);

        if(studentDto.teacherIds && studentDto.teacherIds.length > 0){
            const teachers = await this.teacherRepository
                .createQueryBuilder('teacher')
                .where('teacher.id IN (:...id)', {
                    id: studentDto.teacherIds.map((id) => id),
                }).getMany();
            teachers.map(async (item) => {
                const teacherStudents = new TeacherStudentEntity();
                teacherStudents.student = student;
                teacherStudents.teacher = item;
                await this.teacherStudentRepository.save(teacherStudents);
            })
        }
        return student;
    }

    async findAllStudents(): Promise<StudentEntity[]>{
        return await this.studentRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.teacherStudents', 'teacherStudents')
            .leftJoinAndSelect('teacherStudents.teacher', 'teacher')
            .getMany();
    }

    async findStudentById(id: number): Promise<StudentEntity>{
        const student = await this.studentRepository
            .createQueryBuilder('student')
            .where('student.id = :id', {id})
            .leftJoinAndSelect('student.teacherStudents', 'teacherStudents')
            .leftJoinAndSelect('teacherStudents.teacher', 'teacher')
            .getOne();

        if(!student) throw new NotFoundException(`Student with "${id}" Not Found`);
        return student;
    }

    async update(id: number, studentDto: StudentDto): Promise<string>{
        const student = await this.studentRepository
            .createQueryBuilder('student')
            .where('student.id = :id', {id})
            .leftJoinAndSelect('student.teacherStudents', 'teacherStudents')
            .getOne();

        if(!student) throw new NotFoundException(`Student with "${id}" Not Found`);
        student.name = studentDto.name;

        if(student.teacherStudents && student.teacherStudents.length > 0){
            const teacherStudents = await this.teacherStudentRepository
                .createQueryBuilder('teacher_student')
                .where('teacher_student.id IN (:...id)', {
                    id: student.teacherStudents.map((teach) => teach.id)
                }).getMany();
            await this.teacherStudentRepository.remove(teacherStudents);
        }

        if(studentDto.teacherIds && studentDto.teacherIds.length > 0){
            const teachers = await this.teacherRepository
                .createQueryBuilder('teacher')
                .where('teacher.id IN (:...id)', {
                    id: studentDto.teacherIds.map((id) => id)
                }).getMany();

            teachers.map(async (item) =>{
                const teacherStudents = new TeacherStudentEntity();
                teacherStudents.student = student;
                teacherStudents.teacher = item;
                await this.teacherStudentRepository.save(teacherStudents);
            })
        }
        return `Student with "${id}" id updated`;
    }

    async delete(id: number): Promise<string>{
        const student = await this.studentRepository.findOne({where: {id}});
        if(!student) throw new NotFoundException(`Student with "${id}" Not Found`);
        await this.studentRepository.remove(student);
        return `Student with "${id}" id deleted`;
    }
}
