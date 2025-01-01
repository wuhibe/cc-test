import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddExampleDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'elkzill',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The comment text',
    example: 'Ja bitte mehr davon 😂❤️',
  })
  @IsString()
  @IsNotEmpty()
  comment_text: string;

  @ApiProperty({
    description: 'The reply text',
    example: '@elkzill noted! 😅🙌',
  })
  @IsString()
  @IsNotEmpty()
  reply_text: string;
}
