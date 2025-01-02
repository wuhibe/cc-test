import { Injectable } from '@nestjs/common';
import { LlmHandlerService } from '../llm-handler/llm-handler.service';
import { POSITIVE_SMILEYS, SMILEY_RESPONSES } from './constants';
import { AddExampleDto } from './dto/add-example.dto';
import { ProposeReplyDto } from './dto/propose-reply.dto';

@Injectable()
export class CommentReplyService {
  constructor(private readonly llmHandlerService: LlmHandlerService) {}

  addExample(addExampleDto: AddExampleDto) {
    return addExampleDto;
  }

  async proposeReply(proposeReplyDto: ProposeReplyDto) {
    const { username, comment_text } = proposeReplyDto;

    const smileyRegex = new RegExp(`^[${POSITIVE_SMILEYS.join('')}\\s]+$`);
    const onlySmileys = smileyRegex.test(comment_text);
    const mentionSmileysRegex = new RegExp(
      `^@[\\w\\._\\d]+(?:\\s+@[\\w\\._\\d]+)*(?:\\s+[${POSITIVE_SMILEYS.join('')}\\s]+)*$`,
    );
    const onlyMentionSmileys = mentionSmileysRegex.test(comment_text);

    if (onlySmileys || onlyMentionSmileys) {
      const randomSmiely =
        SMILEY_RESPONSES[Math.floor(Math.random() * SMILEY_RESPONSES.length)];
      if (onlySmileys) {
        const response = `@${username} ${randomSmiely}`;
        return {
          proposed_response: response,
        };
      } else if (onlyMentionSmileys) {
        const response = `${randomSmiely}`;
        return {
          proposed_response: response,
        };
      }
    } else {
      // TODO: Implement the logic for complex comments
      const response =
        await this.llmHandlerService.chatCompletion(comment_text);
      return {
        proposed_response: response,
      };
    }
  }
}
