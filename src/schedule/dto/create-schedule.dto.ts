import { ApiProperty } from "@nestjs/swagger";

export class CreateScheduleDto {
  @ApiProperty({
    example: "123456789",
    description: "ID пользователя в телеграм",
  })
  readonly tgId: string;

  @ApiProperty({ example: "* * 0 * * *", description: "Время в формате cron" })
  readonly reminder: string;
}
