import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { SetsModule } from './sets/set.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StudyLogsModule } from './study-logs/study-log.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    UsersModule,
    SetsModule,
    AnalyticsModule,
    StudyLogsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}