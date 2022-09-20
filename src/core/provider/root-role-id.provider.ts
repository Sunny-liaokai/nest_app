import { FactoryProvider } from '@nestjs/common';
import { ROOT_ROLE_ID } from '../../modules/admin.constants';
import { ConfigService } from '@nestjs/config';

/**
 * 自定义提供者 工厂模式
 * 使用 @Inject(ROOT_ROLE_ID) 直接获取RootRoleId 注入即可使用  全局方便统一管理 不需要导入文件相对import的方式来说
 */
export function useFactoryRootRoleId(): FactoryProvider {
  return {
    provide: ROOT_ROLE_ID,
    useFactory: (configService: ConfigService) => {
      // 获取配置文件中的默认根角色
      return configService.get<number>('ROOT_ROLE_ID', 1);
    },
    inject: [ConfigService],
  };
}
