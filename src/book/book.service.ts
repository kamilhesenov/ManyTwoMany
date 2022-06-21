import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookEntity } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { AuthorBookEntity } from '../entities/author-book.entity';
import { AuthorEntity } from '../entities/author.entity';
import { BookDto } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(AuthorBookEntity)
    private readonly authorBookRepository: Repository<AuthorBookEntity>,
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,
  ) {}

  async create(bookDto: BookDto): Promise<BookEntity> {
    const book = new BookEntity();
    book.name = bookDto.name;
    await this.bookRepository.save(book);

    if (bookDto.authorIds && bookDto.authorIds.length > 0) {
      const authors = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.id IN (:...id)', {
          id: bookDto.authorIds.map((id) => id),
        })
        .getMany();

      authors.map(async (item) =>{
        const authorBooks = new AuthorBookEntity();
        authorBooks.book = book;
        authorBooks.author = item;
        await this.authorBookRepository.save(authorBooks);
      })
    }
    return book;
  }

  async findAllBooks(): Promise<BookEntity[]>{
    return await this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.authorBooks', 'authorBooks')
        .leftJoinAndSelect('authorBooks.author', 'author')
        .getMany();
  }

  async findBookById(id: number): Promise<BookEntity>{
    const book = await this.bookRepository
        .createQueryBuilder('book')
        .where('book.id = :id', {id})
        .leftJoinAndSelect('book.authorBooks', 'authorBooks')
        .leftJoinAndSelect('authorBooks.author', 'author')
        .getOne();
    if(!book) throw new NotFoundException(`Book with "${id}" id Not Found`);
    return book;
  }

  async update(id: number, bookDto: BookDto){
    const book = await this.bookRepository
        .createQueryBuilder('book')
        .where('book.id = :id', {id})
        .leftJoinAndSelect('book.authorBooks', 'authorBooks')
        .getOne();
    if(!book) throw new NotFoundException(`Book with "${id}" id Not Found`);
    book.name = bookDto.name;

    if(book.authorBooks && book.authorBooks.length > 0){
      const authorBooks = await this.authorBookRepository
          .createQueryBuilder('author_book')
          .where('author_book.id IN (:...id)', {
            id: book.authorBooks.map((au)=> au.id),
          })
          .getMany();
      await this.authorBookRepository.remove(authorBooks);
    }

    if(bookDto.authorIds && bookDto.authorIds.length > 0){
      const authors = await this.authorRepository
          .createQueryBuilder('author')
          .where('author.id IN (:...id)', {
            id: bookDto.authorIds.map((id)=> id),
          })
          .getMany();

      authors.map(async (item)=>{
        const authorBooks = new AuthorBookEntity();
        authorBooks.book = book;
        authorBooks.author = item;
        await this.authorBookRepository.save(authorBooks);
      })
    }
    return {message: "Book updated"}
  }

  async delete(id: number): Promise<string>{
    const book = await this.bookRepository.findOne({where: {id}})
    if(!book) throw new NotFoundException(`Book with "${id}" id Not Found`);
    await this.bookRepository.remove(book);
    return `Book with "${id}" id deleted`;
  }
}
