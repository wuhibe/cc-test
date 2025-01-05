import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { PrismaService } from '../prisma/prisma.service';
import { PROMPT_TEMPLATE } from '../utils/constants';

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
    console.log('New reply example added.');
    return res;
  }

  async getVectorStore(comment: string): Promise<MemoryVectorStore> {
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

  async chatCompletion(comment: string): Promise<string> {
    const vectorStore = await this.getVectorStore(comment);

    const examples = [];
    const documents = await vectorStore.similaritySearch(comment, 5);
    const selectedExamples = documents.map((doc) => ({
      username: doc.metadata.username,
      comment: doc.metadata.comment,
      reply: doc.metadata.reply,
      character_count: doc.metadata.character_count,
    }));
    selectedExamples.forEach((example) => {
      const { username, comment, reply } = example;
      examples.push(['user', `@${username}: ${comment}`]);
      examples.push(['ai', reply]);
    });

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', PROMPT_TEMPLATE],
      ...examples,
      ['user', `{input}`],
    ]);
    const parser = new StringOutputParser();
    const chain = promptTemplate.pipe(this.llm).pipe(parser);

    const response = await chain.invoke({ input: comment });

    return response;
  }
}
