import {
  Controller,
  Get,
  Query,
  Headers,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { ImageCaptcha, LoginToken } from './login.class';
import { ImageCaptchaDto, LoginInfoDto } from './login.dto';
import { UtilService } from '../../shared/services/util.service';

import { FastifyRequest } from 'fastify';
import { Authorize } from '../../core/decorators/authorize.decorator';
@ApiTags('登录模块')
@Controller()
export class LoginController {
  constructor(private loginService: LoginService, private utils: UtilService) {}

  @ApiOperation({
    summary: '获取登录图片验证码',
  })
  @ApiOkResponse({ type: ImageCaptcha })
  @Get('captcha/img')
  @Authorize()
  async captchaByImg(@Query() dto: ImageCaptchaDto): Promise<ImageCaptcha> {
    return this.loginService.createImageCaptcha(dto);
  }

  @ApiOperation({
    summary: '用户登录',
  })
  @ApiOkResponse({ type: LoginToken })
  @Post('login')
  @Authorize()
  async login(
    @Body() dto: LoginInfoDto,
    @Req() req: FastifyRequest,
    @Headers('user-agent') ua: string,
  ): Promise<LoginToken> {
    // 验证验证码是否正确
    await this.loginService.checkImgCaptcha(dto.captchaId, dto.verifyCode);
    // 查询用户
    const token = await this.loginService.getLoginSign(
      dto.username,
      dto.password,
      this.utils.getReqIp(req),
      ua,
    );
    return { token };
  }
}
