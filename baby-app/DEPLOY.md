# 배포 가이드

## 구조

```
baby-app/   ← React 소스 (여기서 개발)
baby/       ← 빌드 결과물 (GitHub Pages가 이걸 서빙)
```

---

## 로컬 개발

```bash
cd baby-app
npm run dev
```

→ http://localhost:5173/baby/ 에서 확인

---

## 배포 방법

### 방법 A. 수동 배포 (권장)

```bash
# 1. 빌드
cd baby-app
npm run build

# 2. 커밋 & 푸시 (baby-app/ + baby/ 둘 다 포함)
cd ..
git add baby-app/ baby/
git commit -m "커밋 메시지"
git push origin main
```

push 후 1~2분 뒤 https://dongmin1215.github.io/baby/ 반영

---

### 방법 B. 자동 배포 (GitHub Actions)

`baby-app/` 하위 파일만 변경해서 push하면 Actions가 자동으로 빌드 후 커밋

```bash
git add baby-app/
git commit -m "커밋 메시지"
git push origin main
```

> GitHub 저장소 → Settings → Actions → General → Workflow permissions  
> **Read and write permissions** 로 설정되어 있어야 동작

---

## 파일 수정 위치

| 수정 내용 | 파일 위치 |
|-----------|-----------|
| 기록 화면 | `baby-app/src/pages/RecordPage.jsx` |
| 주간 화면 | `baby-app/src/pages/WeeklyPage.jsx` |
| 설정 화면 | `baby-app/src/pages/SettingsPage.jsx` |
| 타임라인 컴포넌트 | `baby-app/src/components/Timeline.jsx` |
| Firebase 설정 | `baby-app/src/firebase.js` |
| 전역 설정 (생년월일 등) | `baby-app/src/SettingsContext.jsx` |
