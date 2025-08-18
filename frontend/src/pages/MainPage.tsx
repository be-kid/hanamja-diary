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
    <div className="page-container">
      <h1>오늘의 할일</h1>

      <div className="add-todo-section">
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="새로운 할일 추가"
        />
        <button onClick={handleAddTodo}>추가</button>
      </div>

      <ul className="todo-list">
        {todos.length === 0 ? (
          <p className="text-center">오늘 할일이 없습니다.</p>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => handleToggleComplete(todo.id, todo.is_completed)}
              />
              <span className="todo-content">{todo.content}</span>
              <button onClick={() => handleDeleteTodo(todo.id)} className="delete-button">
                삭제
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="completion-rate">
        오늘의 달성률: {completionRate.toFixed(0)}%
      </div>

      <button onClick={() => navigate('/calendar')} className="navigate-button">
        달력 보기
      </button>
    </div>
  );
};

export default MainPage;
