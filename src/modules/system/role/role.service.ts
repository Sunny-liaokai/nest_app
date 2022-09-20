import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SysRoleEntity } from 'src/entites/admin/sys-role.entity';
import { Repository } from 'typeorm';
import { SysRoleMenuEntity } from 'src/entites/admin/sys-role-menu.entity';
import { isEmpty, map } from 'lodash';
import SysUserRoleEntity from 'src/entites/admin/sys-user-role.entity';

@Injectable()
export class SysRoleService {
  constructor(
    @InjectRepository(SysRoleEntity)
    private roleRepository: Repository<SysRoleEntity>,
    @InjectRepository(SysRoleMenuEntity)
    private roleMenuRepository: Repository<SysRoleMenuEntity>,
    @InjectRepository(SysUserRoleEntity)
    private userRoleRepository: Repository<SysUserRoleEntity>,
  ) {}

  /**
   * 创建角色
   * @param body
   * @param uid
   */
  async create(body: CreateRoleDto, uid: number): Promise<{ roleId: number }> {
    const { name, menus, label, remark, depts } = body;

    const isExist = await this.roleRepository.findOne({ name });
    if (isExist) throw new HttpException('角色已存在', 500);

    const role = await this.roleRepository.insert({
      name,
      label,
      remark,
      userId: `${uid}`,
    });
    const roleId = parseInt(role.identifiers[0].id);
    if (menus && menus.length) {
      //关联菜单
      const Menus = menus.map((m) => {
        return {
          roleId,
          menuId: m,
        };
      });
      await this.roleMenuRepository.insert(Menus);
    }
    return { roleId };
  }

  findAll() {
    return `This action returns all role`;
  }

  /**
   * 根据用户id查找角色信息
   * @param id
   */
  async findUserRoleInfo(id: number) {
    // 查找该用户所拥有的角色列表
    const result = await this.userRoleRepository.find({
      where: {
        userId: id,
      },
    });
    if (!isEmpty(result)) {
      return map(result, (v) => v.roleId);
    }
    return [];
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
