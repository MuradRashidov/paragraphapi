import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res) {
    console.log(`User: ${req.user.email}`);
    const userData = await this.authService.login(req.user);
    res.redirect(
      `https://blogpost-paragraphui-re93.vercel.app/api/auth/google/callback?userId=${userData.id}&name=${userData.name}&avatar=${userData.avatar}&token=${userData.token}`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-token')
  verifyToken() {
    return 'ok';
  }
}
