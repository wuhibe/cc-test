import { Module } from '@nestjs/common';
import { LlmHandlerService } from './llm-handler.service';

@Module({
  providers: [LlmHandlerService],
  exports: [LlmHandlerService],
})
export class LlmHandlerModule {}
