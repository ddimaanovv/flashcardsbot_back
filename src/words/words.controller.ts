import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CreateWordDto } from "./dto/create-word.dto";
import { WordsService } from "./words.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Word } from "./words.model";
import { AuthGuard } from "src/guards/TelegramUserValidation.guard";
import { UpdateWordDto } from "./dto/update-word.dto";

@ApiTags("Слова")
@Controller("words")
@UseGuards(AuthGuard)
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @ApiOperation({ summary: "Создание слова" })
  @ApiResponse({ status: 200, type: Word })
  @Post()
  create(@Body() wordDto: CreateWordDto) {
    return this.wordsService.createWord(wordDto);
  }

  @ApiOperation({ summary: "Получение всех слов" })
  @ApiResponse({
    status: 200,
    description: "Возвращает массив слов пользователя",
    type: [Word],
  })
  @Post(":tgId")
  getAll(@Param("tgId") tgId: string) {
    return this.wordsService.getAllWords(tgId);
  }

  @ApiOperation({ summary: "Редактирование слова" })
  @ApiResponse({ status: 200, type: [Word] })
  @Put()
  update(@Body() word: UpdateWordDto) {
    return this.wordsService.updateWord(word);
  }

  @ApiOperation({ summary: "Удаление слова" })
  @ApiResponse({ status: 200, type: [Word] })
  @Delete()
  delete(@Body() word: UpdateWordDto) {
    return this.wordsService.deleteWord(word);
  }
}
