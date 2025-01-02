import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmHandlerService {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.9,
    });
  }

  async chatCompletion(comment: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(
      'Generate an appropriate response to the following comment: {input}',
    );
    const parser = new StringOutputParser();
    const chain = prompt.pipe(this.llm).pipe(parser);

    const response = await chain.invoke({ input: comment });
    return response;
  }
}
