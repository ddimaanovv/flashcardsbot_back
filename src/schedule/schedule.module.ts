import { Module } from "@nestjs/common";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Schedule } from "./schedule.model";

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [SequelizeModule.forFeature([Schedule])],
  exports: [ScheduleService],
})
export class ScheduleModule {}
