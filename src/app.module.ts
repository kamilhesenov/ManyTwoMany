import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), BookModule, AuthorModule, TeacherModule, StudentModule],
})
export class AppModule {}
