import { Body, Controller, Post } from '@nestjs/common';
import { CommentReplyService } from './comment-reply.service';
import { AddExampleDto } from './dto/add-example.dto';
import { ProposeReplyDto } from './dto/propose-reply.dto';

@Controller('comment-reply')
export class CommentReplyController {
  constructor(private readonly commentReplyService: CommentReplyService) {}

  @Post('add-example')
  addExample(@Body() addExampleDto: AddExampleDto) {
    return this.commentReplyService.addExample(addExampleDto);
  }

  @Post('propose-reply')
  proposeReply(@Body() proposeReplyDto: ProposeReplyDto) {
    return this.commentReplyService.proposeReply(proposeReplyDto);
  }
}
