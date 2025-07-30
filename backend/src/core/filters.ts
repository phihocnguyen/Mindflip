import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
  
      let errorMessage: string;
      let errorData: any = null;
  
      if (exception instanceof BadRequestException) {
        // Đây là lỗi từ ValidationPipe
        errorMessage = 'Dữ liệu không hợp lệ.';
        // Lấy chi tiết lỗi validation
        errorData = (exceptionResponse as any).message; 
      } else {
        errorMessage = (exceptionResponse as any).message || exception.message;
      }
  
      response.status(status).json({
        statusCode: status,
        message: errorMessage,
        data: errorData,
      });
    }
  }