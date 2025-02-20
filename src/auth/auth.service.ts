import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInInput } from './dto/signIn.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/auth-jwtPayload';
import { User } from '@prisma/client';
import { CreateUserInput } from 'src/user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async validateLocalUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) new UnauthorizedException('User Not Found');
    const passwordMached = await verify(user.password, password);
    if (!passwordMached) throw new UnauthorizedException('Invalid Credentials');
    return user;
  }
  async generateToken(id: number) {
    const payload: JwtPayload = {
      sub: id,
    };
    const token = await this.jwt.signAsync(payload);
    return token;
  }

  async login(user: User) {
    const token = await this.generateToken(user.id);
    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      token,
    };
  }
  async validateJwtUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User Not Found');
    const currentUser = {
      id: user.id,
    };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });
    if (user) {
      const { password, ...authUser } = user;
      return authUser;
    }
    const dbUser = await this.prisma.user.create({ data: { ...googleUser } });
    const { password, ...authUser } = dbUser;
    return authUser;
  }
}
