import { Controller, Get } from '@nestjs/common';
import { SysUserService } from '../system/user/user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { currentUser } from '../../core/decorators/current-user.deccorator';
import { IAdminUser } from '../admin.interface';
import { LoginService } from '../login/login.service';

@ApiTags('账户模块')
@Controller()
export class AccountController {
  constructor(
    private readonly userService: SysUserService,
    private loginService: LoginService,
  ) {}

  @ApiOperation({ summary: '获取管理员资料' })
  @Get('info')
  async info(@currentUser() user: IAdminUser) {
    return await this.userService.getAccountInfo(user.uid, null);
  }

  @ApiOperation({ summary: '获取用户权限列表和菜单列表' })
  @Get('permissionMenu')
  async PermissionMenu(@currentUser() user: IAdminUser) {
    return await this.loginService.getPermMenu(user.uid);
  }
}
