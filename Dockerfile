# Python 기반 이미지
FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 프로젝트 복사
COPY . .

# collectstatic 실행 (배포 시)
RUN python manage.py collectstatic --noinput

# Django 포트 노출
EXPOSE 8000
