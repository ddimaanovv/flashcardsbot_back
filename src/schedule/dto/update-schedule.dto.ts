import { ApiProperty } from "@nestjs/swagger";

export class UpdateScheduleDto {
  @ApiProperty({
    example: "auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>",
    description:
      "Данные из поля Telegram.WebApp.initData для проверки пользователя",
  })
  readonly tgInitData: string;

  @ApiProperty({
    example: 1,
    description: "ID напоминания",
  })
  readonly id: number;

  @ApiProperty({
    example: 123456789,
    description: "ID пользователя в телеграм",
  })
  readonly tgId: string;

  @ApiProperty({ example: "* * 0 * * *", description: "Время в формате cron" })
  readonly reminder: string;
}
