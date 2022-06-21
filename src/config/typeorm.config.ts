import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'kamil90',
  database: 'manyTwoMany',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
