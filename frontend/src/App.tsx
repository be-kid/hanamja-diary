import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import CalendarPage from './pages/CalendarPage';
import './App.css'; // App.css는 이제 비어있거나 최소한의 스타일만 포함
import './index.css'; // 전역 스타일 임포트

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li>
              <Link to="/signup">회원가입</Link>
            </li>
            <li>
              <Link to="/">메인</Link>
            </li>
            <li>
              <Link to="/calendar">달력</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
