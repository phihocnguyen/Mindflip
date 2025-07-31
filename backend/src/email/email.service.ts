import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    // Khởi tạo Resend client với API key từ biến môi trường
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(to: string, username: string, token: string) {
    const verificationLink = `http://localhost:3001/auth/verify-email?token=${token}`; // Sẽ thay bằng domain frontend sau

    try {
      await this.resend.emails.send({
        from: 'Vocabulary App <onboarding@resend.dev>', // Resend yêu cầu domain này cho free plan
        to: [to],
        subject: 'Chào mừng bạn! Vui lòng xác thực email',
        html: `
          <h1>Chào ${username},</h1>
          <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào link bên dưới để kích hoạt tài khoản:</p>
          <a href="http://localhost:3000/?token${verificationLink}">Kích hoạt tài khoản</a>
          <p>Link sẽ hết hạn sau 1 giờ.</p>
        `,
      });
      console.log('Verification email sent successfully.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Could not send verification email.');
    }
  }
}