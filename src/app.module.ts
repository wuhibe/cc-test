import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentReplyModule } from './comment-reply/comment-reply.module';

@Module({
  imports: [CommentReplyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
