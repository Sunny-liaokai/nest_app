import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

/**
 * 角色实体
 */
@Entity('sys_role')
export class SysRoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'user_id' })
  @ApiProperty()
  userId: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ length: 50, unique: true }) //unique唯一
  @ApiProperty()
  label: string;

  @Column({ nullable: true }) // 可以为空
  @ApiProperty()
  remark: string;
}
