import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommentReplyModule } from './comment-reply/comment-reply.module';

@Module({
  imports: [CommentReplyModule],
  controllers: [AppController],
})
export class AppModule {}
