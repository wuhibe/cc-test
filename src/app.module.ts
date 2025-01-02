import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommentReplyModule } from './comment-reply/comment-reply.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CommentReplyModule],
  controllers: [AppController],
})
export class AppModule {}
