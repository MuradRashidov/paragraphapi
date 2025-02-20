import { Injectable } from '@nestjs/common';
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
    });
  }
  count() {
    return this.prisma.post.count();
  }
  getPostById(id: number) {
    return this.prisma.post.findUnique({ where: { id },include:{author:true,tags:true} });
  }
}
