import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  findAll({
    skip = 0,
    take = DEFAULT_PAGE_SIZE,
  }: {
    skip?: number;
    take?: number;
  }) {
    return this.prisma.post.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
  count() {
    return this.prisma.post.count();
  }
  getPostById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true, tags: true },
    });
  }
  async findByUser({
    userId,
    skip,
    take,
  }: {
    userId: number;
    skip: number;
    take: number;
  }) {
    return await this.prisma.post.findMany({
      where: {
        author: {
          id: userId,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        published: true,
        slug: true,
        title: true,
        thumbnail: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      take,
      skip,
    });
  }

  async userPostCount(userId: number) {
    return this.prisma.post.count({
      where: {
        authorId: userId,
      },
    });
  }
  async create({
    createPostInput,
    authorId,
  }: {
    createPostInput: CreatePostInput;
    authorId: number;
  }) {
    return await this.prisma.post.create({
      data: {
        ...createPostInput,
        author: {
          connect: {
            id: authorId,
          },
        },
        tags: {
          connectOrCreate: createPostInput.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }
  async update({
    updatePostInput,
    authorId,
  }: {
    updatePostInput: UpdatePostInput;
    authorId: number;
  }) {
    const updatedPost = await this.prisma.post.findUnique({
      where: {
        id: updatePostInput.postId,
        authorId,
      },
    });
    if (!updatedPost) throw new UnauthorizedException('Unauthorized');
    const { postId, ...data } = updatePostInput;
    return await this.prisma.post.update({
      where: { id: updatePostInput.postId },
      data: {
        ...data,
        tags: updatePostInput.tags?.length
          ? {
              set: [],
              connectOrCreate: updatePostInput.tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
    });
  }

  async delete({ postId, userId }: { postId: number; userId: number }) {
    const authorIdMatched = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
    });

    if (!authorIdMatched) throw new UnauthorizedException();

    const result = await this.prisma.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    return !!result;
  }
}
