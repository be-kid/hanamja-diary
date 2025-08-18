import React from 'react';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', data);
      localStorage.setItem('accessToken', response.data.accessToken);
      alert('로그인 성공!');
      navigate('/'); // 로그인 성공 후 메인 페이지로 이동
    } catch (error: any) {
      alert(error.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div className="page-container">
      <h2>로그인</h2>
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
