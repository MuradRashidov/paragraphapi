import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // ✅ GraphQL Mutation'a gönderilen input argümanlarını al
    const args = ctx.getArgs();
   // console.log('GraphQL Args:', args);

    // 📌 request.body'ye `signInInput` bilgisini ekle
    request.body = { ...args.signInInput };

    return request;
  }
}
