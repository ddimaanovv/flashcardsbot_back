import { ApiProperty } from "@nestjs/swagger";

export class UpdateWordDto {
  @ApiProperty({
    example: "auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>",
    description:
      "Данные из поля Telegram.WebApp.initData для проверки пользователя",
  })
  readonly tgInitData: string;

  @ApiProperty({
    example: 1,
    description: "ID слова",
  })
  readonly id: number;

  @ApiProperty({
    example: 123456789,
    description: "ID пользователя в телеграм",
  })
  readonly tgId: string;

  @ApiProperty({
    example: "Hello",
    description: "Слово для перевода",
  })
  readonly word: string;

  @ApiProperty({
    example: "Привет",
    description: "Перевод",
  })
  readonly translate: string;
}
