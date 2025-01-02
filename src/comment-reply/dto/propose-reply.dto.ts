import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProposeReplyDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'elkzill',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  username: string;

  @ApiProperty({
    description: 'The comment text',
    example: 'Ja bitte mehr davon 😂❤️',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  comment_text: string;
}
