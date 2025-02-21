import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  likePost(
    @Context() ctx,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = ctx.req.user.id;
    return this.likeService.likePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  unlikePost(
    @Context() ctx,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = ctx.req.user.id;
    return this.likeService.unlikePost(userId, postId);
  }

  @Query(() => Int)
  getPostLikesCount(@Args('postId', { type: () => Int! }) postId: number) {
    return this.likeService.getPostLikesCount(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  userLikedPost(
    @Context() ctx,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    const userId = ctx.req.user.id;
    return this.likeService.userLikedPost(userId, postId);
  }
}
