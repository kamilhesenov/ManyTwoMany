import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {AuthorEntity} from "../entities/author.entity";
import {Repository} from "typeorm";
import {AuthorBookEntity} from "../entities/author-book.entity";
import {BookEntity} from "../entities/book.entity";
import {AuthorDto} from "./dto/author.dto";

@Injectable()
export class AuthorService {
    constructor(
        @InjectRepository(AuthorEntity)
        private readonly authorRepository: Repository<AuthorEntity>,
        @InjectRepository(AuthorBookEntity)
        private readonly authorBookRepository: Repository<AuthorBookEntity>,
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>
    ) {
    }

    async create(authorDto: AuthorDto): Promise<AuthorEntity> {
        const author = new AuthorEntity();
        author.name = authorDto.name;
        await this.authorRepository.save(author);

        if (authorDto.bookIds && authorDto.bookIds.length > 0) {
            const books = await this.bookRepository
                .createQueryBuilder('book')
                .where('book.id IN (:...id)', {
                    id: authorDto.bookIds.map((id) => id),
                }).getMany();

            books.map(async (item) => {
                const authorBooks = new AuthorBookEntity();
                authorBooks.author = author;
                authorBooks.book = item;
                await this.authorBookRepository.save(authorBooks);
            })
        }
        return author;
    }

    async findAllAuthors(): Promise<AuthorEntity[]>{
        return await this.authorRepository
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.authorBooks', 'authorBooks')
            .leftJoinAndSelect('authorBooks.book', 'book')
            .getMany();
    }

    async findAuthorById(id: number): Promise<AuthorEntity>{
        const author = await this.authorRepository
            .createQueryBuilder('author')
            .where('author.id = :id', {id})
            .leftJoinAndSelect('author.authorBooks', 'authorBooks')
            .leftJoinAndSelect('authorBooks.book', 'book')
            .getOne();
        if(!author) throw new NotFoundException(`Author with "${id}" id Not Found`);

        return author;
    }

    async update(id: number, authorDto: AuthorDto): Promise<string>{
        const author = await this.authorRepository
            .createQueryBuilder('author')
            .where('author.id = :id', {id})
            .leftJoinAndSelect('author.authorBooks', 'authorBooks')
            .getOne();
        if(!author) throw new NotFoundException(`Author with "${id}" id Not Found`);
        author.name = authorDto.name;

        if(author.authorBooks && author.authorBooks.length > 0){
            const authorBooks = await this.authorBookRepository
                .createQueryBuilder('author_book')
                .where('author_book.id IN (:...id)', {
                    id: author.authorBooks.map((au) => au.id)
                }).getMany();
            await this.authorBookRepository.remove(authorBooks);
        }

        if(authorDto.bookIds && authorDto.bookIds.length > 0){
            const books = await this.bookRepository
                .createQueryBuilder('book')
                .where('book.id IN (:...id)', {
                    id: authorDto.bookIds.map((id)=> id),
                }).getMany();

            books.map(async (item)=>{
                const authorBooks = new AuthorBookEntity();
                authorBooks.author = author;
                authorBooks.book = item;
                await this.authorBookRepository.save(authorBooks);
            })
        }
        return `Author with "${id} updated"`;
    }

    async delete(id: number): Promise<string>{
        const author = await this.authorRepository.findOne({where: {id}});
        if(!author) throw new NotFoundException(`Author with "${id}" id Not Found`);
        await this.authorRepository.remove(author);

        return `Author with "${id} deleted"`;
    }
}
