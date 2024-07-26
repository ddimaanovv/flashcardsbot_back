import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { WordsModule } from "./words/words.module";
import { ConfigModule } from "@nestjs/config";
import { Word } from "./words/words.model";
import { BotService } from "./bot/bot.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "../../flashcardsbot-front/build"),
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Word],
      autoLoadModels: true,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false, // Trust the self-signed certificate
        },
      },
    }),
    WordsModule,
  ],
  controllers: [],
  providers: [BotService],
})
export class AppModule {}
