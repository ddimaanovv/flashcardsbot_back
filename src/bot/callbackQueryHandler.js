import {
  addWordOption,
  startOptions,
  trainingStatOptions,
  wordOptions,
} from "./optionsSet.js";

let counter = {}; // содержит id пользователей и счетчик их слов во время тренировки
// {
//   id1: count,
//   id2: count
// }
let allWords = {}; // содержит id пользователей и массив слов для тренировки
// {
//   id1: [{word:"qwe", translate: "qwe"}, {word:"asd", translate: "asd"}],
//   id2: [{word:"qwe", translate: "qwe"}]
// }
let messageToEdit = {}; // содержит id пользователей и массив id сообщений (сейчас одно) которые необходио править в ходе тренировки

export async function callbackQueryHandler(action, msg, bot, wordService) {
  try {
    switch (action) {
      case "newWord":
        await newWordAdditionMessage(msg.chat.id, msg.message_id, bot);
        break;
      case "training":
        await startTraining(msg.chat.id, msg.message_id, bot, wordService);
        break;
      case "next":
        await sendWordsForUser(msg.chat.id, msg.message_id, bot);
        break;
      case "stop":
        await stopTraining(msg.chat.id, msg.message_id, bot);
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

let stopTraining = async function (chatID, msgID, bot) {
  counter[chatID] = 0;
  await bot.editMessageText(`Вы остановили тренировку`, {
    chat_id: chatID,
    message_id: messageToEdit[chatID][0],
    ...startOptions,
  });
  bot.deleteMessage(chatID, msgID);
};

let startTraining = async function (chatID, msgID, bot, wordService) {
  allWords[chatID] = await wordService.getAllWords(String(chatID));
  console.log(allWords[chatID]);
  let totalWordsMessage = await bot.editMessageText(
    `Всего слов: ${allWords[chatID].length}\nСлов до конца тренировки: ${allWords[chatID].length}`,
    {
      chat_id: chatID,
      message_id: msgID,
      ...trainingStatOptions,
    }
  );
  messageToEdit[chatID] = [];
  messageToEdit[chatID].push(totalWordsMessage.message_id);
  counter[chatID] = 0;
  await sendWordsForUser(chatID, msgID, bot);
};

let newWordAdditionMessage = async function (chatID, msgID, bot) {
  await bot.editMessageText(
    "Введите слово и перевод через тире\nhello - привет\nhome - дом, жилье",
    {
      chat_id: chatID,
      message_id: msgID,
      ...addWordOption,
    }
  );
};

let sendWordsForUser = async function (chatID, msgID, bot) {
  if (counter[chatID] !== 0) await bot.deleteMessage(chatID, msgID); // удалить старое слово
  if (counter[chatID] < allWords[chatID].length) {
    await editCountToEndMessageText(chatID, bot);
    await bot.sendMessage(
      // отправить новое слово
      chatID,
      messageCreator(counter[chatID], chatID),
      wordOptions
    );
    counter[chatID] = counter[chatID] + 1;
  } else {
    counter[chatID] = 0;
    await bot.editMessageText(`Слов изучено: ${allWords[chatID].length}`, {
      chat_id: chatID,
      message_id: messageToEdit[chatID][0],
      ...startOptions,
    });
  }
};

let editCountToEndMessageText = async function name(chatID, bot) {
  if (counter[chatID] === 0) return; // при отправке первого слова редактировать текст не нужно
  let wordsToEnd = allWords[chatID].length - counter[chatID];
  await bot.editMessageText(
    `Всего слов: ${allWords[chatID].length}\nСлов до конца тренировки: ${wordsToEnd}`,
    {
      chat_id: chatID,
      message_id: messageToEdit[chatID][0],
      ...trainingStatOptions,
    }
  );
};

let messageCreator = function (wordNumber, id) {
  let text = "";
  if (allWords[id][wordNumber]) {
    text = `${allWords[id][wordNumber].word} - <span class="tg-spoiler">${allWords[id][wordNumber].translate}</span>`;
  }
  return text;
};
