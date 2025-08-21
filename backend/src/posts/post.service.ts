import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostCategory, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

interface FindAllPostsOptions {
  category?: PostCategory;
  page?: number;
  limit?: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const newPost = new this.postModel({ ...createPostDto, author: authorId });
    const savedPost = await newPost.save();
    // Populate author information before returning
    return savedPost.populate('author', 'name avatar');
  }

  async findAll(options: FindAllPostsOptions = {}) {
    const { category, page = 1, limit = 5 } = options;
    const query = category ? { category } : {};
    const [posts, total] = await Promise.all([
      this.postModel
        .find(query)
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.postModel.countDocuments(query).exec()
    ]);

    const hasMore = total > page * limit; 

    return {
      data: posts,
      hasMore,
    };
  }

  findOne(id: string) {
    return this.postModel.findById(id).populate('author', 'name avatar').exec();
  }
  
  async remove(id: string, userId: string) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Không tìm thấy bài đăng với ID "${id}".`);
    }
    

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài đăng này.');
    }

    if (post.author.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài đăng này.');
    }
    // Cần xóa các comment liên quan sau
    return post.deleteOne();
  }
  
  async toggleLike(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException(`Không tìm thấy bài đăng với ID "${postId}".`);
    }
    const userObjectId = new Types.ObjectId(userId);
    const userIndex = post.likes.findIndex(id => id.equals(userObjectId));

    if (userIndex > -1) {
      post.likes.splice(userIndex, 1);
      await this.userModel.updateOne({ _id: post.author }, { $inc: { score: -1 } });
    } else {
      post.likes.push(userObjectId as any);
      await this.userModel.updateOne({ _id: post.author }, { $inc: { score: 1 } });
    }
    const updatedPost = await post.save();
    return updatedPost.populate('author', 'name avatar');
  }
}