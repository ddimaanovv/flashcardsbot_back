import { Module } from "@nestjs/common";
import { WordsController } from "./words.controller";
import { WordsService } from "./words.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Word } from "./words.model";

@Module({
  controllers: [WordsController],
  providers: [WordsService],
  imports: [SequelizeModule.forFeature([Word])],
  exports: [WordsService],
})
export class WordsModule {}
