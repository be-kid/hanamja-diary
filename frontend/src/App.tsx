import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainPage from './pages/MainPage';
import CalendarPage from './pages/CalendarPage'; // CalendarPage 임포트
import './App.css';

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
              <Link to="/calendar">달력</Link> {/* 달력 페이지 링크 추가 */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/calendar" element={<CalendarPage />} /> {/* 달력 페이지 라우트 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
