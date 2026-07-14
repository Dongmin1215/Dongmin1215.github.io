# 이안이 하루 기록 앱

아기의 수면, 놀이, 수유를 기록하고 타임라인으로 확인하는 웹 앱

**프로덕션:** https://dongmin1215.github.io/baby/

---

## 구조

```
baby-app/
├── src/          ← React 프론트엔드
│   ├── pages/    ← 화면 (기록, 주간, 설정)
│   ├── components/
│   ├── hooks/
│   └── SettingsContext.jsx
├── server/       ← Express 백엔드 (Firebase Admin SDK)
└── vite.config.js

baby/             ← 빌드 결과물 (GitHub Pages 서빙)
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 19, React Router, Vite |
| 백엔드 | Node.js, Express |
| 데이터베이스 | Firebase Realtime Database |
| 배포 (프론트) | GitHub Pages |
| 배포 (서버) | Render |

---

## 로컬 개발

터미널 두 개를 열어서 각각 실행:

```bash
# 터미널 1 — 백엔드 서버
cd baby-app/server
npm install
npm run dev        # http://localhost:3001

# 터미널 2 — 프론트엔드
cd baby-app
npm install
npm run dev        # http://localhost:5173/baby/
```

로컬 서버는 Firebase DB의 `dev/baby/...` 경로를 사용해 프로덕션 데이터와 분리돼요.

---

## 배포

배포 방법은 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

---

## API

서버 베이스 URL: `https://dongmin1215-github-io.onrender.com`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/records/:date` | 날짜별 기록 조회 (예: `2026-07-14`) |
| POST | `/api/records/:date` | 기록 추가 |
| GET | `/api/settings` | 설정 조회 |
| PUT | `/api/settings` | 설정 저장 |

---

## 주요 파일

| 파일 | 설명 |
|------|------|
| `src/pages/RecordPage.jsx` | 메인 기록 화면 (수면/놀이/수유) |
| `src/pages/WeeklyPage.jsx` | 주간 통계 화면 |
| `src/pages/SettingsPage.jsx` | 설정 화면 |
| `src/components/Timeline.jsx` | 하루 타임라인 컴포넌트 |
| `src/SettingsContext.jsx` | 전역 설정 (생년월일, 항목 목록) |
| `src/hooks/useRecords.js` | 기록 CRUD 훅 |
| `server/index.js` | API 서버 |
