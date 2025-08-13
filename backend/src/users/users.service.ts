import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { StudySet, StudySetDocument } from '../sets/schemas/set.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(StudySet.name) private readonly setModel: Model<StudySetDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  async getUserProfile(id: string) {
    const user = await this.userModel.findById(id).select('-password -emailVerificationToken').exec();
    
    if (!user) {
      return null;
    }
    
    // Lấy các bộ từ vựng công khai của người dùng
    const publicSets = await this.setModel
      .find({ creatorId: id, isPublic: true })
      .populate('creatorId', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();
    
    // Lấy các bài viết cộng đồng của người dùng
    const blogPosts = await this.postModel
      .find({ author: id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .exec();
    
    return {
      user,
      publicSets,
      blogPosts,
    };
  }
}