# 1. 베이스 이미지 설정
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 의존성 설치
COPY package.json ./
# NestJS는 package-lock.json을 생성하지 않을 수 있으므로, 이 라인은 주석 처리하거나 삭제하는 것이 안전합니다.
# COPY package-lock.json ./
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. NestJS 앱 실행 (개발 모드)
CMD ["npm", "run", "start:dev"]
