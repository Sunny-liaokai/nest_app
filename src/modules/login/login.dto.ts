import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ImageCaptchaDto {
  @ApiProperty({
    required: false,
    default: 100,
    description: '验证码图片长度',
  })
  @Type(() => Number) //类型为number
  @IsInt() // 必须是整数
  @IsOptional() // 可选的
  readonly width: number = 100;

  @ApiProperty({
    required: false,
    default: 50,
    description: '验证码图片高度',
  })
  @Type(() => Number) //类型为number
  @IsInt() // 必须是整数
  @IsOptional() // 可选的
  readonly height: number = 50;
}

export class LoginInfoDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ description: '用户名密码' })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ description: '验证码标识' })
  @IsString()
  captchaId: string;

  @ApiProperty({ description: '用户输入的验证码' })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  verifyCode: string;
}
