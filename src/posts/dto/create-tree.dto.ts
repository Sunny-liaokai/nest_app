import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class common {
  @ApiPropertyOptional({ description: '名称' })
  @IsNotEmpty({ message: '名称是必须的' })
  readonly name: string;
}

export class CreateTreeDto extends common {
  // @ApiPropertyOptional({ description: '父级id' })
  // @IsNotEmpty({ message: '父级id是必须的' })
  // readonly parentId: number;
}

export class EditTreeDto extends common {
  @ApiPropertyOptional({ description: '角色id' })
  @IsNotEmpty({ message: 'id是必须的' })
  readonly id: number;
}

export class DeleteTree {
  @ApiPropertyOptional({ description: '角色id' })
  @IsNotEmpty({ message: 'id不能为空' })
  readonly id: number;
}
