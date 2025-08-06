import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostCategory, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { Types } from 'mongoose';
@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  create(createPostDto: CreatePostDto, authorId: string) {
    const newPost = new this.postModel({ ...createPostDto, author: authorId });
    return newPost.save();
  }

  findAll(category?: PostCategory) {
    const query = category ? { category } : {};
    return this.postModel
      .find(query)
      .populate('author', 'name avatar') // Chỉ lấy name và avatar của tác giả
      .sort({ createdAt: -1 })
      .exec();
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
    } else {
      post.likes.push(userObjectId as any);
    }
    return post.save();
  }
}