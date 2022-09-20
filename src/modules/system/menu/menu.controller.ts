import { Body, Controller, Get, Post } from '@nestjs/common';
import { SysMenuService } from './menu.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto } from './dto/menu.dto';

@Controller('menu')
@ApiTags('菜单管理')
export class SysMenuController {
  constructor(private menuService: SysMenuService) {}

  @Get()
  @ApiOperation({ summary: '查询所有菜单' })
  findAll() {
    return this.menuService.getMenuAll();
  }

  @Post('add')
  @ApiOperation({ summary: '创建菜单或权限' })
  Add(@Body() dto: CreateMenuDto): Promise<void> {
    if (dto.parentId === -1 || !dto.parentId) {
      dto.parentId = null;
    }
    return this.menuService.create(dto);
  }
}
