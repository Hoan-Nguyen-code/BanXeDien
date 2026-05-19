import React from "react";

// Định nghĩa kiểu dữ liệu cho các props truyền vào component
interface PasswordResetEmailProps {
  username: string;
  resetLink: string;
}

const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  username,
  resetLink,
}) => {
  return (
    <div>
      <p>Chào {username}!</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
      <p>Vui lòng nhấn vào liên kết dưới đây để đặt lại mật khẩu:</p>
      <p>
        <a href={resetLink}>Đặt lại mật khẩu của bạn</a>
      </p>
      <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
    </div>
  );
};

export default PasswordResetEmail;
