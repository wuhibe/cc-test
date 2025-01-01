import { Module } from '@nestjs/common';
import { CommentReplyService } from './comment-reply.service';
import { CommentReplyController } from './comment-reply.controller';

@Module({
  controllers: [CommentReplyController],
  providers: [CommentReplyService],
})
export class CommentReplyModule {}
