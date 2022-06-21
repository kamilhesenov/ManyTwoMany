import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BookEntity } from './book.entity';
import { AuthorEntity } from './author.entity';

@Entity('author_books')
export class AuthorBookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @Column()
  bookId: number;

  @ManyToOne((type) => BookEntity, (book) => book.authorBooks, {onDelete: "CASCADE"})
  book: BookEntity;

  @ManyToOne((type) => AuthorEntity, (author) => author.authorBooks, {onDelete: "CASCADE"})
  author: AuthorEntity;
}
