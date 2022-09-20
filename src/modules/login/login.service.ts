import { HttpException, Inject, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import { isEmpty } from 'lodash';
import { ImageCaptchaDto } from './login.dto';
import { ImageCaptcha, PermMenuInfo } from './login.class';
import { UtilService } from 'src/shared/services/util.service';
import { RedisService } from '../../shared/services/redis.service';
import { SysUserService } from '../system/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SysMenuService } from '../system/menu/menu.service';

@Injectable()
export class LoginService {
  constructor(
    private util: UtilService,
    private redisService: RedisService,
    private userService: SysUserService,
    private jwtService: JwtService,
    private menuService: SysMenuService,
  ) {}

  /**
   * 创建验证码并缓存加入redis缓存
   */
  async createImageCaptcha(captcha: ImageCaptchaDto): Promise<ImageCaptcha> {
    const svg = svgCaptcha.create({
      size: 4,
      color: true,
      noise: 4,
      width: isEmpty(captcha.width) ? 100 : captcha.width,
      height: isEmpty(captcha.height) ? 50 : captcha.height,
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
        'base64',
      )}`,
      id: this.util.generateUUID(),
    };
    // 5分钟过期时间
    await this.redisService
      .getRedis()
      .set(`admin:captcha:img:${result.id}`, svg.text, 'EX', 60 * 5);
    return result;
  }

  /**
   * 校验验证码
   */
  async checkImgCaptcha(id: string, code: string): Promise<void> {
    const result = await this.redisService
      .getRedis()
      .get(`admin:captcha:img:${id}`);
    if (isEmpty(result)) {
      throw new HttpException('验证码不存在或已过期', 400);
    }
    if (code.toLowerCase() !== result.toLowerCase()) {
      throw new HttpException('验证码不正确', 400);
    }
    // 成功后移除验证码
    await this.redisService.getRedis().del(`admin:captcha:img:${id}`);
  }

  /**
   *获取登录Jwt
   * 返回null则账号密码有误，不存在该用户
   */
  async getLoginSign(
    username: string,
    password: string,
    ip: string,
    ua: string,
  ): Promise<string> {
    // 查询用户
    const user = await this.userService.findUserByUserName(username);
    if (isEmpty(user)) {
      throw new HttpException('用户不存在', 500);
    }
    const comparePassword = this.util.md5(`${password}${user.psalt}`);
    if (user.password !== comparePassword) {
      throw new HttpException('用户名或密码不正确', 400);
    }
    //生成token
    const jwtSign = this.jwtService.sign({
      uid: parseInt(user.id.toString()),
      pv: 1, // 密码版本用来做权限判断是否修改过密码
    });
    await this.redisService
      .getRedis()
      .set(`admin:passwordVersion:${user.id}`, 1);
    // 设置token过期时间 24小时 EX代表秒 PX代表毫秒 NX值不存在才进行设置 XX值存在就设置
    await this.redisService
      .getRedis()
      .set(`admin:token:${user.id}`, jwtSign, 'EX', 60 * 60 * 24);
    return jwtSign;
  }

  /**
   * 获取用户权限菜单
   */
  async getPermMenu(uid: number): Promise<PermMenuInfo> {
    const menus = await this.menuService.getMenus(uid);
    const perms = await this.menuService.getPerms(uid);
    return { menus, perms };
  }

  async getRedisPasswordVersionById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:passwordVersion:${id}`);
  }

  async getRedisTokenById(id: number): Promise<string> {
    return this.redisService.getRedis().get(`admin:token:${id}`);
  }
}
