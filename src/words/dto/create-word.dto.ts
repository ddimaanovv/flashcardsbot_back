import { ApiProperty } from "@nestjs/swagger";

export class CreateWordDto {
  @ApiProperty({
    example: "123456789",
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
