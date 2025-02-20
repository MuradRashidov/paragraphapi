import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signIn.input';
import { AuthResponse } from './entities/AuthResponse.entity';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Mutation(() => AuthResponse)
  async signIn(@Args('signInInput') signInInput: SignInInput,@Context() ctx) {
    // const user = await this.authService.validateLocalUser(signInInput);
    console.log(12345);
    
     return this.authService.login(ctx.req.user);
  }
}
