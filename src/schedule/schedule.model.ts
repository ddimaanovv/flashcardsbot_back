import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ScheduleAttrs {
  tgId: string;
  reminder: string;
}

@Table({ tableName: "schedule" })
export class Schedule extends Model<Schedule, ScheduleAttrs> {
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

  @ApiProperty({ example: "* * 0 * * *", description: "Время в формате cron" })
  @Column({ type: DataType.STRING, allowNull: false })
  reminder: string;
}
