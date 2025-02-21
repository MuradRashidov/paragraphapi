import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}
  async likePost(userId: number, postId: number) {
    try {
      return !!(await this.prisma.like.create({ data: { userId, postId } }));
    } catch (error) {
      throw new BadRequestException('You have allready liked this post');
    }
  }
  async unlikePost(userId: any, postId: number) {
    try {
      await this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return true;
    } catch (error) {
      throw new BadRequestException('Like not found');
    }
  }
  async getPostLikesCount(postId: number) {
    return await this.prisma.like.count({ where: { postId } });
  }
  async userLikedPost(userId: number, postId: number) {
    const like =await this.prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
    return !!like;
  }
}
