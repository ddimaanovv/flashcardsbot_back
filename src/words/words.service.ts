import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Word } from "./words.model";
import { CreateWordDto } from "./dto/create-word.dto";
import CryptoJS from "crypto-js";
import { UpdateWordDto } from "./dto/update-word.dto";

@Injectable()
export class WordsService {
  constructor(@InjectModel(Word) private wordRepository: typeof Word) {}

  async createWord(dto: CreateWordDto) {
    const word = await this.wordRepository.create(dto);
    return word;
  }
  async getAllWords(tgId: string) {
    const words = await this.wordRepository.findAll({
      where: { tgId: tgId },
      order: ["id"],
    });
    return words;
  }

  async updateWord(word: UpdateWordDto) {
    console.log(word);

    const updatedWord = await this.wordRepository.findOne({
      where: {
        id: word.id,
        tgId: word.tgId,
      },
    });
    console.log(updatedWord);
    updatedWord.word = word.word;
    updatedWord.translate = word.translate;
    console.log(updatedWord);
    await updatedWord.save();
    return await this.getAllWords(word.tgId);
  }

  async deleteWord(word: UpdateWordDto) {
    const deletedWord = await this.wordRepository.findOne({
      where: {
        id: word.id,
        tgId: word.tgId,
      },
    });
    await deletedWord.destroy();
    return await this.getAllWords(word.tgId);
  }
}
