# 📜 GitHub 운영 및 프로젝트 협업 가이드

본 문서는 프로젝트의 초기 설정부터 일상적인 개발 작업, 협업 전략, 그리고 저장소 최적화 및 문제 해결까지의 과정을 상황별 흐름에 따라 정리한 기술 매뉴얼입니다.

---

## 1단계: 프로젝트 시작하기 (Initial Setup)

### 1.1 최초 환경 설정
컴퓨터에 Git 사용자 정보를 등록합니다.
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.2 저장소 준비
- **새 프로젝트 시작**: `git init` -> `git remote add origin <url>`
- **기존 프로젝트 참여**: `git clone <repository_url>`

---

## 2단계: 일상적인 개발 흐름 (Daily Workflow)

### 2.1 변경 사항 확인 및 스테이징
작업 중인 파일의 상태를 확인하고 커밋할 준비를 합니다.
```bash
git status               # 현재 변경된 파일 목록 확인
git add <file>           # 특정 파일 스테이징
git add .                # 변경된 모든 파일 스테이징
```

### 2.2 커밋 (기록 남기기)
의미 있는 단위로 작업 내용을 기록합니다.
```bash
git commit -m "feat: [COMMIT_0000X] 기능 설명"
```

### 2.3 원격 저장소 동기화
로컬 작업물을 올리고 타인의 작업물을 가져옵니다.
```bash
git pull origin <branch> # 원격의 최신 코드 가져오기
git push origin <branch> # 로컬 커밋 올리기
```

---

## 3단계: 협업과 브랜치 전략 (Branching & Merge)

### 3.1 브랜치 생성 및 이동
신규 기능 개발이나 버그 수정을 위해 독립된 공간을 만듭니다.
```bash
git checkout -b feature/<기능명> # 브랜치 생성 및 즉시 이동
git checkout <branch_name>     # 기존 브랜치로 이동
```

### 3.2 병합 (Merge)
작업이 완료된 브랜치를 메인 브랜치에 합칩니다.
1. `git checkout main` (메인으로 이동)
2. `git pull origin main` (최신 상태 유지)
3. `git merge feature/<기능명>` (기능 합치기)

### 3.3 충돌 해결 (Conflict Resolution)
동일한 코드를 여러 명이 수정했을 때 발생합니다.
1. 충돌 파일 열기
2. `<<<<<<<`, `=======`, `>>>>>>>` 영역 중 남길 코드를 결정하여 수정
3. `git add <file>` -> `git commit` 으로 해결 완료

---

## 4단계: 작업 효율화 및 관리 (Efficiency & Maintenance)

### 4.1 작업 임시 저장 (Stash)
급하게 브랜치를 이동해야 하는데 커밋하기엔 이른 경우 사용합니다.
```bash
git stash                # 현재 작업 임시 저장
git stash list           # 저장 목록 확인
git stash pop            # 가장 최근 저장 내용 복구 및 삭제
```

### 4.2 저장소 최적화 (git gc)
저장소의 용량을 줄이고 명령 실행 속도를 높입니다.
```bash
git count-objects -v     # 용량 상태 점검
git gc --aggressive      # 불필요 파일 정리 및 압축
```

### 4.3 원격 브랜치 목록 정리 (Prune)
원격에서 이미 삭제된 브랜치가 로컬에 남아있을 때 정리합니다.
```bash
git remote prune origin
```

---

## 5단계: 히스토리 수정 및 복구 (History Management)

### 5.1 커밋 보완 (Amend)
방금 막 수행한 커밋에 파일을 추가하거나 메시지를 바꿀 때 사용합니다.
```bash
git commit --amend --no-edit # 파일만 추가할 때
git commit --amend -m "메시지 수정"
```

### 5.2 특정 커밋만 가져오기 (Cherry-pick)
다른 브랜치의 특정 작업 건만 현재 브랜치로 복사해옵니다.
```bash
git cherry-pick <commit_id>
```

### 5.3 되돌리기 (Reset vs Revert)
- **Reset**: 특정 시점으로 돌아가고 이후 기록을 삭제 (로컬용)
  `git reset --hard <commit_id>`
- **Revert**: 특정 커밋의 작업을 취소하는 '새 커밋' 생성 (협업용/안전)
  `git revert <commit_id>`

### 5.4 사라진 커밋 복구 (Reflog)
실수로 지운 커밋의 ID를 찾아 복구합니다.
```bash
git reflog
git reset --hard <reflog_id>
```

---

## 6단계: 프로젝트 표준 (Standards)

### 6.1 GitHub Pages 배포 가이드 (Deployment)
본 프로젝트의 Renderer(웹 파트)를 GitHub Pages에 배포하여 데모 또는 웹 버전을 공유할 수 있습니다.

#### 6.1.1 프로젝트 설정 (Vite)
GitHub Pages는 하위 경로에서 실행되는 경우가 많으므로 `vite.config.ts` 파일에서 베이스 경로를 상대 경로로 설정해야 합니다.
```typescript
// vite.config.ts
export default defineConfig({
  base: './', // 빌드된 자산이 상대 경로를 참조하도록 설정
  // ...
});
```

#### 6.1.2 수동 배포 (gh-pages 브랜치 사용)
`gh-pages` 패키지를 사용하여 편리하게 배포할 수 있습니다.
1. **패키지 설치**: `npm install gh-pages --save-dev`
2. **스크립트 추가** (`package.json`):
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. **배포 실행**: `npm run deploy`

#### 6.1.3 자동 배포 (GitHub Actions)
`.github/workflows/deploy.yml` 파일을 생성하여 `main` 브랜치 푸시 시 자동 배포되도록 설정할 수 있습니다. (추천 방식)

#### 6.1.4 GitHub 저장소 설정
1. 저장소의 **Settings > Pages** 메뉴로 이동합니다.
2. **Build and deployment > Source**를 설정합니다.
   - **Deploy from a branch**: `gh-pages` 브랜치를 선택합니다.
   - (Actions 사용 시) **GitHub Actions**를 선택합니다.
3. 배포가 완료되면 상단에 생성된 URL을 확인합니다.

#### 6.1.5 주의사항 (SPA 라우팅)
- GitHub Pages는 SPA의 클라이언트 사이드 라우팅을 기본적으로 지원하지 않습니다. 
- 이를 해결하기 위해 `dist/index.html`을 복사하여 `dist/404.html`을 생성하는 트릭이 필요할 수 있습니다.

