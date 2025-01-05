import { Document } from '@langchain/core/documents';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ReplyExamples } from '@prisma/client';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LlmHandlerService {
  private llm: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;
  private vectorStore: MemoryVectorStore;

  constructor(private readonly prismaService: PrismaService) {
    this.llm = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.9,
    });
    this.embeddings = new OpenAIEmbeddings();
    this.vectorStore = new MemoryVectorStore(this.embeddings);
    this.loadReplyExamplesToVectorStore().then(() => {
      console.log('Reply examples loaded to vector store');
    });
  }

  async addReplyExample(
    username: string,
    comment: string,
    reply: string,
  ): Promise<ReplyExamples> {
    const embedding = await this.embeddings.embedQuery(comment);
    const res = await this.prismaService.replyExamples.create({
      data: {
        username,
        comment,
        embedding,
        character_count: comment.length,
        reply,
      },
    });
    const doc = new Document({
      pageContent: res.reply,
      metadata: {
        character_count: res.character_count,
        username: res.username,
        comment: res.comment,
      },
    });
    this.vectorStore.addVectors([embedding], [doc]);
    return res;
  }

  async loadReplyExamplesToVectorStore() {
    const examples = await this.prismaService.replyExamples.findMany();
    const docs = [];
    const embeddings = [];
    for (const example of examples) {
      const doc = new Document({
        pageContent: example.reply,
        metadata: {
          character_count: example.character_count,
          username: example.username,
          comment: example.comment,
        },
      });
      docs.push(doc);
      embeddings.push(example.embedding);
    }
    await this.vectorStore.addVectors(embeddings, docs);
  }
}
