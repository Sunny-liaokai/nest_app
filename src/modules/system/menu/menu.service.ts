import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import SysMenuEntity from 'src/entites/admin/sys-menu.entity';
import { getRepository, IsNull, Not, Repository } from 'typeorm';
import { SysRoleService } from '../role/role.service';
import { ROOT_ROLE_ID } from '../../admin.constants';
import { includes, isEmpty } from 'lodash';

@Injectable()
export class SysMenuService {
  constructor(
    @InjectRepository(SysMenuEntity)
    private menuRepository: Repository<SysMenuEntity>,
    private roleService: SysRoleService,
    @Inject(ROOT_ROLE_ID) private rootRoleId: number,
  ) {}

  /**
   * 获取所有的菜单
   */
  async getMenuAll() {
    return this.menuRepository.find();
  }

  /**
   * 保存或新增菜单
   * @param body
   */
  async create(body: CreateMenuDto & { id?: number }): Promise<void> {
    await this.menuRepository.save(body);
  }

  /**
   * 根据用户的id获取用户所有的菜单
   * @param uid
   */
  async getMenus(uid: number): Promise<SysMenuEntity[]> {
    // 获取 角色列表的id
    const roleIds = await this.roleService.findUserRoleInfo(uid);
    // 如果是管理员角色 管理员id默认为1 则获取所有菜单
    let menus: SysMenuEntity[] = [];
    if (includes(roleIds, this.rootRoleId)) {
      menus = await this.menuRepository.find();
    } else {
      menus = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect(
          'sys_role_menu',
          'role_menu',
          'role_menu.menu_id = menu.id',
        )
        .andWhere('role_menu.role_id IN (:...roles)', { roles: roleIds })
        .orderBy('menu.order_num', 'DESC')
        .getMany();
    }
    return menus;
  }

  /**
   * 获取当前用户所有权限
   * @param uid
   */
  async getPerms(uid: number): Promise<string[]> {
    const roleIds = await this.roleService.findUserRoleInfo(uid);
    let perms: any[] = [];
    let result: SysMenuEntity[] = [];
    if (includes(roleIds, this.rootRoleId)) {
      //如果存在管理员角色 则将所有权限返回
      result = await this.menuRepository.find({
        perms: Not(IsNull()), // 不为空的数据
        type: 2, //权限
      });
    } else {
      result = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect(
          'sys_role_menu',
          'role_menu',
          'menu.id = role_menu.menu_id',
        )
        .andWhere('role_menu.role_id IN (:...roles)', { roles: roleIds })
        .andWhere('menu.type=2')
        .andWhere('menu.perms IS NOT NULL')
        .getMany();
    }
    if (!isEmpty(result)) {
      perms = result.reduce((pre, cur) => {
        return pre.concat(cur.perms.split(','));
      }, []);
    }
    return perms;
  }
}
