import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { AuthorBookEntity } from '../entities/author-book.entity';
import { AuthorEntity } from '../entities/author.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, AuthorBookEntity, AuthorEntity]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
