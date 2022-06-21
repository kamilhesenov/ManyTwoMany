import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { AuthorService } from './author.service';
import {ApiTags} from "@nestjs/swagger";
import {AuthorDto} from "./dto/author.dto";
import {AuthorEntity} from "../entities/author.entity";

@ApiTags('author')
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  createAuthor(@Body() authorDto: AuthorDto): Promise<AuthorEntity>{
    return this.authorService.create(authorDto);
  }

  @Get()
  getAllAuthors(): Promise<AuthorEntity[]>{
    return this.authorService.findAllAuthors();
  }

  @Get(':id')
  getAuthorById(@Param('id', ParseIntPipe) id: number): Promise<AuthorEntity>{
    return this.authorService.findAuthorById(id);
  }

  @Put(':id')
  updateAuthor(@Param('id', ParseIntPipe) id: number, @Body() authorDto: AuthorDto): Promise<string>{
    return this.authorService.update(id, authorDto);
  }

  @Delete(':id')
  deleteAuthor(@Param('id', ParseIntPipe) id: number): Promise<string>{
    return this.authorService.delete(id);
  }
}
