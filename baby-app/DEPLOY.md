# 배포 가이드

## 구조

```
baby-app/
├── src/       ← React 프론트엔드 소스
├── server/    ← Express 백엔드 (Firebase Admin SDK)
baby/          ← 프론트 빌드 결과물 (GitHub Pages가 이걸 서빙)
```

프론트(GitHub Pages)와 서버(Render 등)는 **별개로 배포**해요.

---

## 로컬 개발

터미널 두 개를 열어서 각각 실행:

```bash
# 터미널 1 — 백엔드 서버
cd baby-app/server
npm run dev        # http://localhost:3001

# 터미널 2 — 프론트엔드
cd baby-app
npm run dev        # http://localhost:5173/baby/
```

---

## 서버 배포 (Render)

서버를 처음 배포하거나 `baby-app/server/` 코드가 바뀐 경우에만 필요해요.

1. [render.com](https://render.com) → **New → Web Service**
2. GitHub 저장소 연결
3. 설정:
   - **Root Directory:** `baby-app/server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. 환경변수(Environment Variables) 추가:

   | Key | Value |
   |-----|-------|
   | `FIREBASE_SERVICE_ACCOUNT` | `serviceAccountKey.json` 파일 전체 내용 (한 줄 JSON) |
   | `FIREBASE_DATABASE_URL` | `https://msdm-mobile-invitation-default-rtdb.asia-southeast1.firebasedatabase.app` |
   | `CORS_ORIGIN` | `https://dongmin1215.github.io` |

5. 배포 후 서버 URL 확인 (예: `https://baby-server-xxxx.onrender.com`)

---

## 프론트엔드 배포 (GitHub Pages)

서버 URL이 확정된 후에 빌드해야 해요.

### 방법 A. 수동 배포 (권장)

```bash
# 1. 빌드 (서버 URL을 환경변수로 지정)
cd baby-app
VITE_API_URL=https://baby-server-xxxx.onrender.com npm run build

# 2. 커밋 & 푸시 (baby-app/ + baby/ 둘 다 포함)
cd ..
git add baby-app/ baby/
git commit -m "커밋 메시지"
git push origin main
```

push 후 1~2분 뒤 https://dongmin1215.github.io/baby/ 반영

---

### 방법 B. 자동 배포 (GitHub Actions)

`baby-app/src/` 하위 파일만 변경해서 push하면 Actions가 자동으로 빌드 후 커밋해요.

```bash
git add baby-app/
git commit -m "커밋 메시지"
git push origin main
```

> GitHub 저장소 → Settings → Actions → General → Workflow permissions  
> **Read and write permissions** 로 설정되어 있어야 동작

> Actions에서 `VITE_API_URL`을 쓰려면 저장소 **Settings → Secrets → Actions**에  
> `VITE_API_URL` 시크릿을 추가하고 `.github/workflows/deploy-baby.yml`에 env로 넘겨야 해요.

---

## 파일 수정 위치

| 수정 내용 | 파일 위치 |
|-----------|-----------|
| 기록 화면 | `baby-app/src/pages/RecordPage.jsx` |
| 주간 화면 | `baby-app/src/pages/WeeklyPage.jsx` |
| 설정 화면 | `baby-app/src/pages/SettingsPage.jsx` |
| 타임라인 컴포넌트 | `baby-app/src/components/Timeline.jsx` |
| 전역 설정 (생년월일 등) | `baby-app/src/SettingsContext.jsx` |
| 서버 API | `baby-app/server/index.js` |
