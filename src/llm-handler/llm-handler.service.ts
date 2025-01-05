import { Document } from '@langchain/core/documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ReplyExample } from '@prisma/client';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import {
  LLM_MODEL,
  PROMPT_TEMPLATE,
  VECTOR_STORE_SIMILARITY_LIMIT,
} from 'src/utils/constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LlmHandlerService {
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  private longReplyExamples: ReplyExample[];
  private shortReplyExamples: ReplyExample[];

  constructor(private readonly prismaService: PrismaService) {
    this.llm = new ChatOpenAI({
      modelName: LLM_MODEL,
    });
    this.embeddings = new OpenAIEmbeddings();
    this.loadReplyExamples().then(() => {
      console.log('Reply examples loaded');
    });
  }

  async loadReplyExamples() {
    this.longReplyExamples = await this.prismaService.replyExample.findMany({
      where: {
        character_count: {
          gte: 25,
        },
      },
    });
    this.shortReplyExamples = await this.prismaService.replyExample.findMany({
      where: {
        character_count: {
          lt: 25,
        },
      },
    });
  }

  async addReplyExample(
    username: string,
    comment: string,
    reply: string,
  ): Promise<{ id: string; character_count: number }> {
    const embedding = await this.embeddings.embedQuery(comment);
    const res = await this.prismaService.replyExample.create({
      data: {
        username,
        comment,
        embedding,
        character_count: comment.length,
        reply,
      },
    });
    const commentLength = comment.length >= 25 ? 'long' : 'short';
    if (commentLength === 'long') {
      this.longReplyExamples.push(res);
    } else {
      this.shortReplyExamples.push(res);
    }

    return { id: res.id, character_count: res.character_count };
  }

  async getReplyExamples(comment: string): Promise<ReplyExample[]> {
    const commentLength = comment.length >= 25 ? 'long' : 'short';
    if (commentLength === 'long' && this.longReplyExamples?.length > 0) {
      return this.longReplyExamples;
    } else if (
      commentLength === 'short' &&
      this.shortReplyExamples?.length > 0
    ) {
      return this.shortReplyExamples;
    } else {
      const examples = await this.prismaService.replyExample.findMany({
        where: {
          character_count:
            commentLength === 'long'
              ? {
                  gte: 25,
                }
              : {
                  lt: 25,
                },
        },
      });
      if (commentLength === 'long') {
        this.longReplyExamples = examples;
      } else {
        this.shortReplyExamples = examples;
      }
      return examples;
    }
  }

  async initializeVectorStore(comment: string): Promise<MemoryVectorStore> {
    const vectorStore = new MemoryVectorStore(this.embeddings);
    const examples = await this.getReplyExamples(comment);
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
    const documents = await vectorStore.similaritySearch(
      comment,
      VECTOR_STORE_SIMILARITY_LIMIT,
    );
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

    const parser = new StringOutputParser();
    const chain = finalPrompt.pipe(this.llm).pipe(parser);
    const response = await chain.invoke({ input: message });

    return response;
  }
}
