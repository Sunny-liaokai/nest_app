import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isEmpty } from 'lodash';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { LoginService } from 'src/modules/login/login.service';
import {
  AUTHORIZE_KEY_METADATA,
  ADMIN_USER,
  PERMISSION_OPTIONAL_KEY_METADATA,
} from 'src/modules/admin.constants';

/**
 * 路由钩子请求之前会执行
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private loginService: LoginService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检测是否是开放类型的，例如获取验证码类型的接口不需要校验，可以加入@Authorize可自动放过
    const authorize = this.reflector.get<boolean>(
      AUTHORIZE_KEY_METADATA,
      context.getHandler(),
    );
    if (authorize) {
      return true;
    }
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers.authorization;
    // 获取 请求头判断是否携带token
    if (isEmpty(token)) {
      throw new HttpException('暂无访问权限', 401);
    }
    try {
      // jwtService.verify解析签名wtService.sign中的token
      request[ADMIN_USER] = this.jwtService.verify(token);
    } catch (e) {
      throw new HttpException('暂无访问权限', 401);
    }
    if (isEmpty(request[ADMIN_USER])) {
      throw new HttpException('暂无访问权限', 401);
    }
    // 获取密码的版本
    const pv = await this.loginService.getRedisPasswordVersionById(
      request[ADMIN_USER].uid,
    );
    // 从redis中取出token
    const redisToken = await this.loginService.getRedisTokenById(
      request[ADMIN_USER].uid,
    );
    // 判断密码是否在登陆期间有修改过
    if (pv !== `${request[ADMIN_USER].pv}`) {
      throw new HttpException('密码版本不一致，请重新登陆', 401);
    }
    // 判断token是否过期 redis中的token会过期 如果过期则说明登陆过时
    if (token !== redisToken) {
      throw new HttpException('登陆已超时，请重新登陆', 401);
    }
    // 注册该注解 ，Api则放行检测 仍然需要验证token
    const notNeedPerm = this.reflector.get<boolean>(
      PERMISSION_OPTIONAL_KEY_METADATA,
      context.getHandler(),
    );
    // Token校验身份通过，判断是否需要权限的url，不需要权限则pass
    if (notNeedPerm) {
      return true;
    }
    return true;
  }
}
