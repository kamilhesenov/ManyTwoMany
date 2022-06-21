import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import { BookService } from './book.service';
import { ApiTags } from '@nestjs/swagger';
import { BookDto } from './dto/book.dto';
import {BookEntity} from "../entities/book.entity";

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  createBook(@Body() bookDto: BookDto): Promise<BookEntity> {
    return this.bookService.create(bookDto);
  }

  @Get()
  getAllBooks(): Promise<BookEntity[]>{
    return this.bookService.findAllBooks();
  }

  @Get(':id')
  getBookById(@Param('id', ParseIntPipe) id: number): Promise<BookEntity>{
    return this.bookService.findBookById(id);
  }

  @Put(':id')
  updateBook(@Param('id', ParseIntPipe) id: number, @Body() bookDto: BookDto){
    return this.bookService.update(id, bookDto);
  }

  @Delete(':id')
  deleteBook(@Param('id', ParseIntPipe) id: number): Promise<string>{
    return this.bookService.delete(id);
  }
}
