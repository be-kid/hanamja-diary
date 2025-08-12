# 1. 베이스 이미지 설정
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 설치
# package.json과 package-lock.json을 먼저 복사하여 불필요한 npm install 방지
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. React 앱 실행
CMD ["npm", "start"]
