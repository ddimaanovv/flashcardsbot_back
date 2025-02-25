import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { HmacSHA256, enc } from "crypto-js";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (process.env.TG_TEST_ENVIRONMENT === "yes") return true;
    return this.verifyTelegramWebAppData(request.body.tgInitData);
  }

  verifyTelegramWebAppData(tgInitData: string): boolean {
    const initData = new URLSearchParams(tgInitData);
    const hash = initData.get("hash");
    const dataToCheck: string[] = [];

    initData.sort();

    initData.forEach(
      (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`)
    );

    const secret = HmacSHA256(process.env.TG_BOT_TOKEN, "WebAppData");
    const _hash = HmacSHA256(dataToCheck.join("\n"), secret).toString(enc.Hex);
    if (hash == _hash) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
