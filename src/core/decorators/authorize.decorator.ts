/**
 * 自定义权限修饰符 允许该Api不校验token权限
 */
import { SetMetadata } from '@nestjs/common';
import { AUTHORIZE_KEY_METADATA } from '../../modules/admin.constants';

export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true);
