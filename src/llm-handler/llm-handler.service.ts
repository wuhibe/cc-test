import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { PROMPT_TEMPLATE } from 'src/utils/constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LlmHandlerService {
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;

  constructor(private readonly prismaService: PrismaService) {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-4o',
    });
    this.embeddings = new OpenAIEmbeddings();
  }

  async addReplyExample(
    username: string,
    comment: string,
    reply: string,
  ): Promise<{ id: string; character_count: number }> {
    const embedding = await this.embeddings.embedQuery(comment);
    const res = await this.prismaService.replyExamples.create({
      data: {
        username,
        comment,
        embedding,
        character_count: comment.length,
        reply,
      },
      select: {
        id: true,
        character_count: true,
      },
    });
    return res;
  }

  async initializeVectorStore(comment: string): Promise<MemoryVectorStore> {
    const vectorStore = new MemoryVectorStore(this.embeddings);
    const examples = await this.prismaService.replyExamples.findMany({
      where: {
        character_count:
          comment.length >= 25
            ? {
                gte: 25,
              }
            : {
                lt: 25,
              },
      },
      take: 100,
    });
    await vectorStore.addVectors(
      examples.map((example) => example.embedding),
      examples.map(
        (example) =>
          new Document({
            pageContent: example.comment,
            metadata: {
              character_count: example.character_count,
              username: example.username,
              comment: example.comment,
              reply: example.reply,
            },
          }),
      ),
    );
    return vectorStore;
  }

  async complexChatCompletion(
    username: string,
    comment: string,
  ): Promise<string> {
    const message = `@${username}: ${comment}`;
    const vectorStore = await this.initializeVectorStore(comment);

    const examples = [];
    const documents = await vectorStore.similaritySearch(comment, 5);
    documents.forEach((doc) => {
      const { username, comment, reply } = doc.metadata;
      examples.push({ input: `@${username}: ${comment}`, output: reply });
    });

    const examplePrompt = ChatPromptTemplate.fromMessages([
      ['user', '{input}'],
      ['ai', '{output}'],
    ]);
    const fewShotPrompt = new FewShotChatMessagePromptTemplate({
      examplePrompt,
      examples,
      inputVariables: [],
    });
    const finalPrompt = ChatPromptTemplate.fromMessages([
      ['system', PROMPT_TEMPLATE],
      ...(await fewShotPrompt.formatMessages({})),
      ['human', '{input}'],
    ]);
    const promptTemplate = await finalPrompt.format({ input: message });
    console.log({ promptTemplate });

    const parser = new StringOutputParser();
    const chain = finalPrompt.pipe(this.llm).pipe(parser);
    const response = await chain.invoke({ input: message });

    return response;
  }
}
