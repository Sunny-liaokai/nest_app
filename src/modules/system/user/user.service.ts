import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SysUserEntity from 'src/entites/admin/sys-user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { isEmpty } from 'lodash';
import { UtilService } from 'src/shared/services/util.service';
import SysUserRoleEntity from '../../../entites/admin/sys-user-role.entity';

@Injectable()
export class SysUserService {
  constructor(
    @InjectRepository(SysUserEntity) // 注入实体
    private readonly userRepository: Repository<SysUserEntity>,
    private util: UtilService,
  ) {}

  /**
   * 根据用户名查找已启用的用户
   * @param username
   */
  async findUserByUserName(
    username: string,
  ): Promise<SysUserEntity | undefined> {
    return await this.userRepository.findOne({
      username,
      status: 1,
    });
  }

  /**
   * 用户新增
   */
  async add(params: CreateUserDto): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('username = :name', { name: params.username })
      .getOne();
    if (!isEmpty(user)) {
      throw new HttpException('用户已存在', 400);
    }
    const Manager = await this.userRepository.manager;
    // 创建 一个事务 事务内的操作如果未成功则会回滚操作
    await Manager.transaction(async (manager) => {
      // 得到一个随机长度32的数字字符串
      const salt = this.util.generateRandomValue(32);
      const password = this.util.md5(`123456${salt}`);
      const user = manager.create(SysUserEntity, {
        ...params,
        psalt: salt,
        password,
      });
      const result = await manager.save(user);
      // await this.userRepository
      //   .createQueryBuilder()
      //   .insert()
      //   .values([])
      //   .execute();
      // 分配角色
      const { roles } = params;
      const insertRoles = roles.map((e) => {
        return {
          roleId: e,
          userId: result.id,
        };
      });

      await manager.insert('sys_user_role', insertRoles);
    });
  }

  async getAccountInfo(uid: number, ip?: string) {
    const user = await this.userRepository.findOne({ id: uid });
    if (isEmpty(user)) {
      throw new HttpException('用户不存在', 500);
    }
    return {
      ...user,
      loginIp: ip,
    };
  }
}
