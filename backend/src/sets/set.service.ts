import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudySet, StudySetDocument } from './schemas/set.schema';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';

@Injectable()
export class SetsService {
  constructor(
    @InjectModel(StudySet.name) private setModel: Model<StudySetDocument>,
  ) {}

  async create(createSetDto: CreateSetDto, userId: string): Promise<StudySet> {
    const newSet = new this.setModel({
      ...createSetDto,
      creatorId: userId,
    });
    return newSet.save();
  }

  async findAllForUser(userId: string): Promise<StudySet[]> {
    return this.setModel.find({ creatorId: userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<StudySet> {
    const studySet = await this.setModel.findById(id).exec();
    if (!studySet) {
      throw new NotFoundException(`Bộ từ với ID "${id}" không tồn tại.`);
    }
    // Chỉ chủ sở hữu mới có quyền xem chi tiết (có thể thay đổi tùy logic)
    if (studySet.creatorId.toString() != userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này.');
    }
    return studySet;
  }

  async update(id: string, updateSetDto: UpdateSetDto, userId: string): Promise<StudySet> {
    await this.findOne(id, userId);

    const updatedSet = await this.setModel.findByIdAndUpdate(
      id,
      updateSetDto,
      { new: true },
    ).exec();
    if (!updatedSet) {
      throw new NotFoundException(`Không thể tìm thấy bộ từ với ID "${id}" để cập nhật.`);
    }

    return updatedSet;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    await this.findOne(id, userId); // findOne đã check quyền sở hữu
    await this.setModel.findByIdAndDelete(id).exec();
    return { message: 'Xóa bộ từ thành công.' };
  }
}