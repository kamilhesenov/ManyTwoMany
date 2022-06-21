import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthorBookEntity } from './author-book.entity';

@Entity('books')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => AuthorBookEntity, (authorBook) => authorBook.book, {cascade: true})
  authorBooks: AuthorBookEntity[];
}
