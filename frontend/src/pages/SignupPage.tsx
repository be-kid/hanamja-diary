import React from "react";
import AuthForm from "../components/AuthForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = async (data: any) => {
    try {
      await axios.post('http://localhost:3001/auth/signup', data);
      alert("회원가입 성공!");
      navigate("/login"); // 회원가입 성공 후 로그인 페이지로 이동
    } catch (error: any) {
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  const handleCheckNickname = async (nickname: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `http://localhost:3001/auth/check-nickname/${nickname}`
      );
      return response.data.available;
    } catch (error) {
      console.error('SignupPage: 닉네임 중복 확인 오류:', error);
      return false;
    }
  };

  return (
    <div className="page-container">
      <h2>회원가입</h2>
      <AuthForm
        isSignup={true}
        onSubmit={handleSignup}
        onCheckNickname={handleCheckNickname}
      />
    </div>
  );
};

export default SignupPage;
