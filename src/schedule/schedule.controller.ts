import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/TelegramUserValidation.guard";
import { ScheduleService } from "./schedule.service";
import { Schedule } from "./schedule.model";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@ApiTags("Слова")
@Controller("schedule")
@UseGuards(AuthGuard)
export class ScheduleController {
  constructor(private controllerService: ScheduleService) {}

  @ApiOperation({ summary: "Создание время для повторения" })
  @ApiResponse({ status: 200, type: Schedule })
  @Post()
  create(@Body() scheduleDto: CreateScheduleDto) {
    return this.controllerService.createReminder(scheduleDto);
  }

  @ApiOperation({ summary: "Получение всех напоминаний" })
  @ApiResponse({
    status: 200,
    description: "Возвращает массив напоминаний пользователя",
    type: [Schedule],
  })
  @Post(":tgId")
  getAll(@Param("tgId") tgId: string) {
    return this.controllerService.getAllRemindersOfUser(tgId);
  }

  @ApiOperation({ summary: "Редактирование напоминания" })
  @ApiResponse({ status: 200, type: [Schedule] })
  @Put()
  update(@Body() reminder: UpdateScheduleDto) {
    return this.controllerService.updateReminder(reminder);
  }

  @ApiOperation({ summary: "Удаление напоминания" })
  @ApiResponse({ status: 200, type: [Schedule] })
  @Delete()
  delete(@Body() reminder: UpdateScheduleDto) {
    return this.controllerService.deleteReminder(reminder);
  }
}
