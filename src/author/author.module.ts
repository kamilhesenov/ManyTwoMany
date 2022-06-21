import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthorEntity} from "../entities/author.entity";
import {AuthorBookEntity} from "../entities/author-book.entity";
import {BookEntity} from "../entities/book.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AuthorEntity, AuthorBookEntity, BookEntity])],
  controllers: [AuthorController],
  providers: [AuthorService]
})
export class AuthorModule {}
