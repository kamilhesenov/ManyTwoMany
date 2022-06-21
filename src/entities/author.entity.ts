import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthorBookEntity } from './author-book.entity';

@Entity('authors')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => AuthorBookEntity, (authorBook) => authorBook.author, {cascade: true})
  authorBooks: AuthorBookEntity[];
}
