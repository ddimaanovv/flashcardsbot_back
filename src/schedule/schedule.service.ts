import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Schedule } from "./schedule.model";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { Sequelize } from "sequelize";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) private scheduleRepository: typeof Schedule
  ) {}

  async getAllReminders() {
    const uniqueUsersId = await this.scheduleRepository.findAll({
      attributes: ["id", "tgId", "reminder"],
      raw: true,
    });
    return uniqueUsersId; //.map((result) => result.get("uniqueValue"));
  }

  async createReminder(reminderDTO: CreateScheduleDto) {
    const reminder = await this.scheduleRepository.create(reminderDTO);
    return reminder;
  }

  async getAllRemindersOfUser(tgId: string) {
    const reminders = await this.scheduleRepository.findAll({
      attributes: ["reminder"],
      where: { tgId: tgId },
      raw: true,
    });
    return reminders.map((reminder) => reminder.reminder);
  }

  async updateReminder(reminderDTO: UpdateScheduleDto) {
    const updatedReminder = await this.scheduleRepository.findOne({
      where: {
        id: reminderDTO.id,
        tgId: reminderDTO.tgId,
      },
    });
    updatedReminder.reminder = reminderDTO.reminder;
    await updatedReminder.save();
    return await this.getAllRemindersOfUser(reminderDTO.tgId);
  }

  async deleteReminder(reminderDTO: UpdateScheduleDto) {
    const deletedReminder = await this.scheduleRepository.findOne({
      where: {
        id: reminderDTO.id,
        tgId: reminderDTO.tgId,
      },
    });
    await deletedReminder.destroy();
    return await this.getAllRemindersOfUser(reminderDTO.tgId);
  }
}
