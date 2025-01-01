import { Injectable } from '@nestjs/common';
import { AddExampleDto } from './dto/add-example.dto';
import { ProposeReplyDto } from './dto/propose-reply.dto';

@Injectable()
export class CommentReplyService {
  addExample(addExampleDto: AddExampleDto) {
    return addExampleDto;
  }

  proposeReply(proposeReplyDto: ProposeReplyDto) {
    return proposeReplyDto;
  }
}
