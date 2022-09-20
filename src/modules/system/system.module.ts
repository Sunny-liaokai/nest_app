import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bull';
import SysUserEntity from 'src/entites/admin/sys-user.entity';
import { SysUserController } from './user/user.controller';
import { SysUserService } from './user/user.service';
import { SysRoleEntity } from 'src/entites/admin/sys-role.entity';
import { SysRoleController } from './role/role.controller';
import { SysRoleService } from './role/role.service';
import { SysMenuController } from './menu/menu.controller';
import { SysMenuService } from './menu/menu.service';
import SysMenuEntity from '../../entites/admin/sys-menu.entity';
import { SysRoleMenuEntity } from '../../entites/admin/sys-role-menu.entity';
import SysUserRoleEntity from '../../entites/admin/sys-user-role.entity';
import { ROOT_ROLE_ID } from '../admin.constants';
import { useFactoryRootRoleId } from '../../core/provider/root-role-id.provider';

@Module({
  imports: [
    // 注册实体
    TypeOrmModule.forFeature([
      SysUserEntity,
      SysRoleEntity,
      SysMenuEntity,
      SysRoleMenuEntity,
      SysUserRoleEntity,
    ]),
  ],
  controllers: [SysUserController, SysRoleController, SysMenuController],
  providers: [
    useFactoryRootRoleId(),
    SysUserService,
    SysRoleService,
    SysMenuService,
  ],
  exports: [ROOT_ROLE_ID, SysUserService, SysMenuService], // 暴露给其他模块使用 比如登陆模块需要用户信息 上下文可使用
})
export class SystemModule {}
