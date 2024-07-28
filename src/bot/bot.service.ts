import { Injectable, OnModuleInit } from "@nestjs/common";
import TelegramBot = require("node-telegram-bot-api");
import { WordsService } from "src/words/words.service";

@Injectable()
export class BotService implements OnModuleInit {
  constructor(private readonly wordService: WordsService) {}
  async onModuleInit() {
    this.botMessage();
  }

  async botMessage() {
    setInterval(() => console.log("Я работаю"), 60000);
    let testEnvironment: boolean;
    process.env.TG_TEST_ENVIRONMENT === "yes"
      ? (testEnvironment = true)
      : (testEnvironment = false);

    const bot = new TelegramBot(process.env.TG_BOT_TOKEN, {
      testEnvironment: testEnvironment,
      polling: true,
    });

    bot.on("text", async (msg) => {
      await this.botOnTextHandler(msg, bot);
    });

    bot.on("callback_query", async (callbackQuery) => {
      const action = callbackQuery.data;
      const msg = callbackQuery.message;
      await this.callbackQueryHandler(action, msg, bot);
      await bot.answerCallbackQuery(callbackQuery.id);
    });
  }

  async botOnTextHandler(msg: TelegramBot.Message, bot: TelegramBot) {
    try {
      let action = msg.text.includes("-") ? "addWord" : msg.text;
      switch (action) {
        case "/start":
          msg.chat.username;
          await bot.sendMessage(
            msg.chat.id,
            `Привет, это бот для изучения слов на иностранном языке, добавляй новые слова и бот будет присылать их тебе на проверку`,
            this.initialOptions
          );
          break;
        case "addWord":
          let wordAndTranslate = msg.text.split("-");
          wordAndTranslate[0] = wordAndTranslate[0].trim();
          wordAndTranslate[1] = wordAndTranslate[1].trim();
          let word =
            wordAndTranslate[0].charAt(0).toUpperCase() +
            wordAndTranslate[0].slice(1);
          let translate =
            wordAndTranslate[1].charAt(0).toUpperCase() +
            wordAndTranslate[1].slice(1);
          console.log(word, translate);

          await this.wordService.createWord({
            tgId: String(msg.chat.id),
            word: word,
            translate: translate,
          });
          await bot.sendMessage(
            msg.chat.id,
            "Слово добавлено",
            this.startOptions
          );
          break;
        default:
          bot.sendMessage(msg.chat.id, "Не понял тебя text");
          break;
      }
    } catch (error) {
      bot.sendMessage(msg.chat.id, "Не понял тебя error text");
      console.log(error.response.body);
    }
  }

  async callbackQueryHandler(
    action: string,
    msg: TelegramBot.Message,
    bot: TelegramBot
  ) {
    try {
      switch (action) {
        case "newWord":
          await this.newWordAdditionMessage(msg.chat.id, msg.message_id, bot);
          break;
        case "training":
          await this.startTraining(msg.chat.id, msg.message_id, bot);
          break;
        case "next":
          await this.sendWordsForUser(msg.chat.id, msg.message_id, bot);
          break;
        case "stop":
          await this.stopTraining(msg.chat.id, msg.message_id, bot);
          break;
        default:
          await bot.sendMessage(msg.chat.id, "Не понял тебя callback_query");
          break;
      }
    } catch (error) {
      if (error.response !== undefined) {
        console.log(error.response.body);
      } else {
        console.log(error);
      }
    }
  }

  async stopTraining(chatID, msgID, bot) {
    this.counter[chatID] = 0;
    await bot.editMessageText(`Вы остановили тренировку`, {
      chat_id: chatID,
      message_id: this.messageToEdit[chatID][0],
      ...this.startOptions,
    });
    bot.deleteMessage(chatID, msgID);
  }

  async startTraining(chatID, msgID, bot) {
    this.allWords[chatID] = await this.wordService.getAllWords(String(chatID));
    let totalWordsMessage = await bot.editMessageText(
      `Всего слов: ${this.allWords[chatID].length}\nСлов до конца тренировки: ${this.allWords[chatID].length}`,
      {
        chat_id: chatID,
        message_id: msgID,
        ...this.trainingStatOptions,
      }
    );
    this.messageToEdit[chatID] = [];
    this.messageToEdit[chatID].push(totalWordsMessage.message_id);
    this.counter[chatID] = 0;
    await this.sendWordsForUser(chatID, msgID, bot);
  }

  async newWordAdditionMessage(chatID, msgID, bot) {
    await bot.editMessageText(
      "Введите слово и перевод через тире\nhello - привет\nhome - дом, жилье",
      {
        chat_id: chatID,
        message_id: msgID,
        ...this.addWordOption,
      }
    );
  }

  async sendWordsForUser(chatID, msgID, bot) {
    if (this.counter[chatID] !== 0) await bot.deleteMessage(chatID, msgID); // удалить старое слово
    if (this.counter[chatID] < this.allWords[chatID].length) {
      await this.editCountToEndMessageText(chatID, bot);
      await bot.sendMessage(
        // отправить новое слово
        chatID,
        this.messageCreator(this.counter[chatID], chatID),
        this.wordOptions
      );
      this.counter[chatID] = this.counter[chatID] + 1;
    } else {
      this.counter[chatID] = 0;
      await bot.editMessageText(
        `Слов изучено: ${this.allWords[chatID].length}`,
        {
          chat_id: chatID,
          message_id: this.messageToEdit[chatID][0],
          ...this.startOptions,
        }
      );
    }
  }

  async editCountToEndMessageText(chatID, bot) {
    if (this.counter[chatID] === 0) return; // при отправке первого слова редактировать текст не нужно
    let wordsToEnd = this.allWords[chatID].length - this.counter[chatID];
    await bot.editMessageText(
      `Всего слов: ${this.allWords[chatID].length}\nСлов до конца тренировки: ${wordsToEnd}`,
      {
        chat_id: chatID,
        message_id: this.messageToEdit[chatID][0],
        ...this.trainingStatOptions,
      }
    );
  }

  messageCreator(wordNumber, id) {
    let text = "";
    if (this.allWords[id][wordNumber]) {
      text = `${this.allWords[id][wordNumber].word} - <span class="tg-spoiler">${this.allWords[id][wordNumber].translate}</span>`;
    }
    return text;
  }

  counter = {}; // содержит id пользователей и счетчик их слов во время тренировки
  // {
  //   id1: count,
  //   id2: count
  // }
  allWords = {}; // содержит id пользователей и массив слов для тренировки
  // {
  //   id1: [{word:"qwe", translate: "qwe"}, {word:"asd", translate: "asd"}],
  //   id2: [{word:"qwe", translate: "qwe"}]
  // }
  messageToEdit = {}; // содержит id пользователей и массив id сообщений (сейчас одно) которые необходио править в ходе тренировки

  initialOptions: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    disable_notification: true,
    reply_markup: {
      inline_keyboard: [[{ text: "Добавить слово", callback_data: "newWord" }]],
    },
  };

  startOptions: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    disable_notification: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Добавить слово", callback_data: "newWord" }],
        [{ text: "Начать тренировку", callback_data: "training" }],
      ],
    },
  };

  addWordOption: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    disable_notification: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Начать тренировку", callback_data: "training" }],
      ],
    },
  };

  wordOptions: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    disable_notification: true,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Далее", callback_data: "next" },
          { text: "Стоп", callback_data: "stop" },
        ],
      ],
    },
  };

  trainingStatOptions: TelegramBot.SendMessageOptions = {
    parse_mode: "HTML",
    disable_notification: true,
  };
}
