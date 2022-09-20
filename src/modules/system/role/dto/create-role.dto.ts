import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @Length(2, 10, { message: '名称最少2个字符最长10个字符' })
  name: string;

  @ApiProperty({ description: '角色唯一标识' })
  @IsString()
  @Matches(/^[a-z0-9A-Z]+$/)
  label: string;

  @ApiProperty({ required: false, description: '角色备注' })
  @IsString()
  @Length(2, 50, { message: '名称最少2个字符最长10个字符' })
  remark: string;

  @ApiProperty({ required: false, description: '关联菜单、权限编号' })
  @IsOptional() // 可选
  @IsArray()
  menus: number[];

  @ApiProperty({ required: false, description: '关联部门编号' })
  @IsOptional() // 可选
  @IsArray()
  depts: number[];
}
