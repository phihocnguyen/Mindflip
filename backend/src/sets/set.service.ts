import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudySet, StudySetDocument } from './schemas/set.schema';
import { CreateSetDto } from './dto/create-set.dto';
import { UpdateSetDto } from './dto/update-set.dto';
import { UpdateTermDto } from 'src/term/dto/update-term.dto';

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

  async updateTermStatus(
    setId: string,
    termId: string,
    updateTermDto: UpdateTermDto,
    userId: string,
  ): Promise<StudySet> {
    const updatedSet = await this.setModel.findOneAndUpdate(
      { _id: setId, creatorId: userId, 'terms._id': termId },
      { $set: { 'terms.$.isLearned': updateTermDto.isLearned } },
      { new: true },
    ).exec();

    if (!updatedSet) {
      throw new NotFoundException(
        'Không tìm thấy bộ từ, không có quyền truy cập, hoặc thẻ từ không tồn tại.',
      );
    }
    const allTermsLearned = updatedSet.terms.every(term => term.isLearned);

    if (allTermsLearned && !updatedSet.isCompleted) {
      updatedSet.isCompleted = true;
      return updatedSet.save();
    }
    if (!allTermsLearned && updatedSet.isCompleted) {
      updatedSet.isCompleted = false;
      return updatedSet.save();
    }
    return updatedSet;
  }

  async findRandomTermsForGame(
    setId: string,
    userId: string,
    limit: number,
  ): Promise<any[]> {
    const studySet = await this.setModel.findById(setId).exec();

    if (!studySet) {
      throw new NotFoundException(`Bộ từ với ID "${setId}" không tồn tại.`);
    }

    if (studySet.creatorId.toString() != userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập vào tài nguyên này.');
    }
    
    const shuffledTerms = [...studySet.terms].sort(() => 0.5 - Math.random());
    
    return shuffledTerms.slice(0, limit);
  }
}