/* 实例 也就是说 通过实体映射到数据库表*/
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class PostsEntity {
  @PrimaryGeneratedColumn()
  id: number; //标记为主列，值自动生成

  @Column({ length: 50 })
  title: string;

  @Column({ length: 50 })
  author: string;

  @Column('text', {
    nullable: true, // 可以为空
  })
  content: string;

  @Column('text', {
    nullable: true, // 可以为空
  })
  cover_url: string;

  // @Column('tinyint')
  // type: number;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  update_time: Date;
}
