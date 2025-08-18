import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // react-calendar 기본 스타일
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CompletionRate {
  date: string;
  rate: number;
}

interface Todo {
  id: number;
  date: string;
  content: string;
  is_completed: boolean;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [monthlyRates, setMonthlyRates] = useState<CompletionRate[]>([]);
  const [selectedDateTodos, setSelectedDateTodos] = useState<Todo[]>([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const fetchMonthlyCompletionRates = useCallback(async (year: number, month: number) => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get<CompletionRate[]>(`http://localhost:3001/todos/monthly-completion-rates?year=${year}&month=${month}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMonthlyRates(response.data);
    } catch (error: any) {
      console.error('월별 달성률 불러오기 실패:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }
  }, [accessToken, navigate]);

  const fetchTodosForSelectedDate = useCallback(async (selectedDate: Date) => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    const formattedDate = selectedDate.toISOString().slice(0, 10);
    try {
      const response = await axios.get<Todo[]>(`http://localhost:3001/todos/${formattedDate}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedDateTodos(response.data);
    } catch (error: any) {
      console.error('선택된 날짜 할일 불러오기 실패:', error.response?.data || error.message);
      setSelectedDateTodos([]); // 에러 발생 시 초기화
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    fetchMonthlyCompletionRates(date.getFullYear(), date.getMonth() + 1);
    fetchTodosForSelectedDate(date); // 페이지 로드 시 현재 날짜의 할일도 불러옴
  }, [date, fetchMonthlyCompletionRates, fetchTodosForSelectedDate]);

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value);
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().slice(0, 10);
      const rate = monthlyRates.find(r => r.date === formattedDate);
      if (rate) {
        return (
          <div style={{ fontSize: '10px', textAlign: 'center', color: rate.rate === 100 ? 'green' : rate.rate > 0 ? 'orange' : 'gray' }}>
            {rate.rate.toFixed(0)}%
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="page-container">
      <h1>달력</h1>
      <button onClick={() => navigate('/')} className="navigate-button margin-bottom-20">
        메인으로 돌아가기
      </button>

      <Calendar
        onChange={handleDateChange}
        value={date}
        onActiveStartDateChange={({ activeStartDate, view }) => {
          if (view === 'month' && activeStartDate instanceof Date) {
            fetchMonthlyCompletionRates(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1);
          }
        }}
        tileContent={tileContent}
        className="react-calendar-custom"
        locale="ko-KR"
        calendarType="gregory" // 일요일 시작
        tileClassName={({ date, view }) => {
          if (view === 'month' && date.toDateString() === new Date().toDateString()) {
            return 'tile-today';
          }
          return null;
        }}
        formatShortWeekday={(locale, date) => ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]}
      />

      <h2 className="text-center margin-top-30">{date.toLocaleDateString()}의 할일</h2>
      {selectedDateTodos.length === 0 ? (
        <p className="text-center">선택된 날짜에 할일이 없습니다.</p>
      ) : (
        <ul className="todo-list">
          {selectedDateTodos.map(todo => (
            <li key={todo.id} className="todo-item-simple">
              {todo.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalendarPage;