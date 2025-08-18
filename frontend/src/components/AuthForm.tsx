import React, { useState } from 'react';

interface AuthFormProps {
  isSignup: boolean;
  onSubmit: (data: any) => void;
  onCheckNickname?: (nickname: string) => Promise<boolean>;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignup, onSubmit, onCheckNickname }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [gender, setGender] = useState<'남자' | '여자'>('남자');
  const [nicknameError, setNicknameError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState(''); // 중복 확인 메시지

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameError(''); // 닉네임 변경 시 에러 초기화
    setNicknameCheckMessage(''); // 닉네임 변경 시 메시지 초기화
  };

  const handleManualNicknameCheck = async () => {
    if (!isSignup || !onCheckNickname) return;
    if (nickname.length < 4 || nickname.length > 20) {
      setNicknameError('닉네임은 4자 이상 20자 이하여야 합니다.');
      setNicknameCheckMessage('');
      return;
    }

    const available = await onCheckNickname(nickname);
    if (available) {
      setNicknameCheckMessage('사용 가능한 닉네임입니다.');
      setNicknameError('');
    } else {
      setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
      setNicknameError('duplicate'); // 에러 상태를 나타내기 위해 사용
    }
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPasswordConfirm = e.target.value;
    setPasswordConfirm(newPasswordConfirm);
    if (isSignup && password !== newPasswordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordConfirmError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && (nicknameError === 'duplicate' || passwordConfirmError || nicknameCheckMessage !== '사용 가능한 닉네임입니다.')) {
      alert('입력 정보를 다시 확인해주세요. 닉네임 중복 확인 및 비밀번호 일치를 확인해주세요.');
      return;
    }

    const data = {
      nickname,
      password,
      ...(isSignup && { gender }),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nickname">닉네임:</label>
        <div className="input-with-button">
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            minLength={4}
            maxLength={20}
            required
          />
          {isSignup && (
            <button type="button" onClick={handleManualNicknameCheck} className="check-button">
              중복검사
            </button>
          )}
        </div>
        {nicknameError && nicknameError !== 'duplicate' && <p className="error-message">{nicknameError}</p>}
        {nicknameCheckMessage && <p className={nicknameCheckMessage.includes('사용 가능') ? 'success-message' : 'error-message'}>{nicknameCheckMessage}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={4}
          maxLength={20}
          required
        />
      </div>
      {isSignup && (
        <div className="form-group">
          <label htmlFor="passwordConfirm">비밀번호 확인:</label>
          <input
            type="password"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            required
          />
          {passwordConfirmError && <p className="error-message">{passwordConfirmError}</p>}
        </div>
      )}
      {isSignup && (
        <div className="form-group">
          <label htmlFor="gender">성별:</label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as '남자' | '여자')}>
            <option value="남자">남자</option>
            <option value="여자">여자</option>
          </select>
        </div>
      )}
      <button type="submit" className="submit-button">{isSignup ? '회원가입' : '로그인'}</button>
    </form>
  );
};

export default AuthForm;
