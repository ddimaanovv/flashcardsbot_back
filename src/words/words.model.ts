import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface WordCreationAttrs {
  tgId: string;
  word: string;
  translate: string;
}

@Table({ tableName: "words" })
export class Word extends Model<Word, WordCreationAttrs> {
  @ApiProperty({ example: "1", description: "Уникальный идентификатор" })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: "123456789",
    description: "ID пользователя в телеграм",
  })
  @Column({ type: DataType.STRING, allowNull: false })
  tgId: string;

  @ApiProperty({ example: "Hello", description: "Слово для перевода" })
  @Column({ type: DataType.STRING, allowNull: false })
  word: string;

  @ApiProperty({ example: "Привет", description: "Перевод" })
  @Column({ type: DataType.STRING, allowNull: false })
  translate: string;
}
