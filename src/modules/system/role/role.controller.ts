import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SysRoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { currentUser } from 'src/core/decorators/current-user.deccorator';
import { IAdminUser } from '../../admin.interface';

@Controller('role')
@ApiTags('角色模块')
export class SysRoleController {
  constructor(private readonly roleService: SysRoleService) {}

  @Post('add')
  @ApiOperation({ summary: '新增角色' })
  async create(
    @Body() dto: CreateRoleDto,
    @currentUser() user: IAdminUser,
  ): Promise<void> {
    await this.roleService.create(dto, user.uid);
  }

  @Get('list')
  @ApiOperation({ summary: '获取角色列表' })
  findAll() {
    return this.roleService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
