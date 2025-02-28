import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Schedule } from "./schedule.model";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule) private scheduleRepository: typeof Schedule
  ) {}

  async createReminder(reminderDTO: CreateScheduleDto) {
    const reminder = await this.scheduleRepository.create(reminderDTO);
    return reminder;
  }

  async getAllReminders(tgId: string) {
    const reminder = await this.scheduleRepository.findAll({
      where: { tgId: tgId },
      order: ["id"],
    });
    return reminder;
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
    return await this.getAllReminders(reminderDTO.tgId);
  }

  async deleteReminder(reminderDTO: UpdateScheduleDto) {
    const deletedReminder = await this.scheduleRepository.findOne({
      where: {
        id: reminderDTO.id,
        tgId: reminderDTO.tgId,
      },
    });
    await deletedReminder.destroy();
    return await this.getAllReminders(reminderDTO.tgId);
  }
}
