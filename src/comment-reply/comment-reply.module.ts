import { Module } from '@nestjs/common';
import { LlmHandlerModule } from '../llm-handler/llm-handler.module';
import { CommentReplyController } from './comment-reply.controller';
import { CommentReplyService } from './comment-reply.service';

@Module({
  imports: [LlmHandlerModule],
  controllers: [CommentReplyController],
  providers: [CommentReplyService],
})
export class CommentReplyModule {}
