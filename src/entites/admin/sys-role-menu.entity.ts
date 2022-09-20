import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_role_menu')
export class SysRoleMenuEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'role_id' })
  roleId: number;

  @ApiProperty()
  /*'simple-array' 传入数组 以逗号分隔开来数组进行存储*/
  @Column({ name: 'menu_id' })
  menuId: number;
}
