import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentReplyService } from './comment-reply.service';
import { AddExampleDto } from './dto/add-example.dto';
import { ProposeReplyDto } from './dto/propose-reply.dto';
import {
  addExampleResponse,
  proposeReplyResponse,
} from './response/response.example';

@ApiTags('Comment Reply')
@Controller('comment-reply')
export class CommentReplyController {
  constructor(private readonly commentReplyService: CommentReplyService) {}

  @ApiOperation({ summary: 'Add an example comment and reply' })
  @ApiResponse({
    status: 201,
    description: 'Example comment and reply added',
    example: addExampleResponse,
  })
  @Post('add-example')
  addExample(@Body() addExampleDto: AddExampleDto) {
    return this.commentReplyService.addExample(addExampleDto);
  }

  @ApiOperation({ summary: 'Propose a reply to a comment' })
  @ApiResponse({
    status: 201,
    description: 'Reply proposed',
    example: proposeReplyResponse,
  })
  @Post('propose-reply')
  proposeReply(@Body() proposeReplyDto: ProposeReplyDto) {
    return this.commentReplyService.proposeReply(proposeReplyDto);
  }
}
