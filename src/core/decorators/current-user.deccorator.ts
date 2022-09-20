import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ADMIN_USER } from '../../modules/admin.constants';

// 创建参数修饰器 获取当前用户信息
export const currentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 获取 auth.guard.ts中解析token中的用户信息
    const user = request[ADMIN_USER];
    return data ? user?.[data] : user;
  },
);
