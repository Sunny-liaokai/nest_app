import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SysUserService } from './user.service';
import { CreateUserDto } from './user.dto';

@ApiSecurity('admin')
@ApiTags('用户模块')
@Controller('user')
export class SysUserController {
  constructor(private userService: SysUserService) {}
  @ApiOperation({
    summary: '新增用户',
  })
  @Post('add')
  async add(@Body() dto: CreateUserDto): Promise<void> {
    await this.userService.add(dto);
  }
}
