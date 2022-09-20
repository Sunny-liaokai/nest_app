import { Injectable } from '@nestjs/common';
import { nanoid, customAlphabet } from 'nanoid';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class UtilService {
  /**
   * 生成一个uuID
   */
  public generateUUID(): string {
    return nanoid();
  }

  /**
   * 获取请求Ip
   */
  getReqIp(req): string {
    return (
      (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress
    ).replace('::ffff:', '');
  }

  /**
   * MD5加密
   */
  public md5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  }

  /**
   * 生成一个随机的值
   */
  public generateRandomValue(
    length: number,
    placeholder = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
  ): string {
    const customNanoid = customAlphabet(placeholder, length);
    return customNanoid();
  }
}
