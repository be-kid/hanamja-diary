import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: number;
  date: string;
  content: string;
  is_completed: boolean;
}

const MainPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [completionRate, setCompletionRate] = useState(0);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const fetchTodosAndRate = useCallback(async () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    try {
      const todosResponse = await axios.get<Todo[]>(`http://localhost:3001/todos/${today}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTodos(todosResponse.data);

      const rateResponse = await axios.get<number>(`http://localhost:3001/todos/completion-rate/${today}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCompletionRate(rateResponse.data);
    } catch (error: any) {
      console.error('할일 목록 또는 달성률 불러오기 실패:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    fetchTodosAndRate();
  }, [fetchTodosAndRate]);

  const handleAddTodo = async () => {
    if (!newTodoContent.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      await axios.post(
        'http://localhost:3001/todos',
        { date: today, content: newTodoContent },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setNewTodoContent('');
      fetchTodosAndRate(); // 목록 새로고침
    } catch (error: any) {
      console.error('할일 추가 실패:', error.response?.data || error.message);
      alert('할일 추가에 실패했습니다.');
    }
  };

  const handleToggleComplete = async (id: number, is_completed: boolean) => {
    try {
      await axios.patch(
        `http://localhost:3001/todos/${id}/complete`,
        { is_completed: !is_completed },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      fetchTodosAndRate(); // 목록 새로고침
    } catch (error: any) {
      console.error('할일 완료 상태 변경 실패:', error.response?.data || error.message);
      alert('할일 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('정말 이 할일을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:3001/todos/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fetchTodosAndRate(); // 목록 새로고침
      } catch (error: any) {
        console.error('할일 삭제 실패:', error.response?.data || error.message);
        alert('할일 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>오늘의 할일</h1>

      {/* 할일 추가 */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="새로운 할일 추가"
          style={{ flexGrow: 1, padding: '10px', fontSize: '16px' }}
        />
        <button onClick={handleAddTodo} style={{ padding: '10px 15px', fontSize: '16px', marginLeft: '10px' }}>
          추가
        </button>
      </div>

      {/* 할일 목록 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.length === 0 ? (
          <p>오늘 할일이 없습니다.</p>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                borderBottom: '1px solid #eee',
                textDecoration: todo.is_completed ? 'line-through' : 'none',
                color: todo.is_completed ? '#aaa' : '#333',
              }}
            >
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => handleToggleComplete(todo.id, todo.is_completed)}
                style={{ marginRight: '10px' }}
              />
              <span style={{ flexGrow: 1 }}>{todo.content}</span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                삭제
              </button>
            </li>
          ))
        )}
      </ul>

      {/* 달성률 */}
      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        오늘의 달성률: {completionRate.toFixed(0)}%
      </div>

      {/* 달력 페이지로 이동 버튼 */}
      <button
        onClick={() => navigate('/calendar')}
        style={{ marginTop: '30px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        달력 보기
      </button>
    </div>
  );
};

export default MainPage;
