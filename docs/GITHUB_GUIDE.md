# GitHub 운영 및 프로젝트 협업 상세 매뉴얼

본 문서는 프로젝트의 Git 관리, 브랜치 전략, 배포 설정, 문제 해결 및 모범 사례를 포함하는 기술 매뉴얼입니다.

---

## 1. Git & GitHub 시작하기
### 1.1 환경 설정
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```
- `--global` 옵션은 사용자 계정 전체에 적용됩니다. 프로젝트별로 다르게 설정하려면 프로젝트 폴더 내에서 `--local`을 사용하세요.

### 1.2 저장소 연결
- **Clone**: `git clone <repository_url>`
- **Init**: 기존 폴더를 저장소로 변환
  ```bash
  git init
  git remote add origin <repository_url>
  git branch -M main
  ```

---

## 2. 브랜치 관리 전략 (Branching Model)
### 2.1 브랜치 구성
- **main**: 프로덕션 환경용 브랜치 (절대 직접 수정 금지).
- **feature/<기능명>**: 신규 기능 구현용 브랜치.
- **fix/<버그명>**: 긴급 버그 수정용 브랜치.

### 2.2 병합 및 삭제
1. **작업 완료 후**: `git checkout main` -> `git pull origin main`
2. **병합**: `git merge feature/<기능명>`
3. **삭제**: 병합 후 원격/로컬 브랜치를 정리하여 저장소의 깔끔함을 유지합니다.
   ```bash
   git branch -d feature/<기능명>          # 로컬 삭제
   git push origin --delete feature/<기능명> # 원격 삭제
   ```

---

## 3. 커밋 이력 관리 (Git Operations)
### 3.1 커밋 메시지 컨벤션
- 규칙: `<type>: [COMMIT_XXXXX] <description>`
- 타입: `feat` (기능), `fix` (버그 수정), `docs` (문서), `refactor` (리팩토링).

### 3.2 작업 내용 보완 (Amend)
- **파일 추가**: 실수로 빠뜨린 파일을 커밋에 포함
  ```bash
  git add <filename>
  git commit --amend --no-edit
  ```
- **메시지 수정**: `git commit --amend -m "[COMMIT_XXXXX] 수정된 메시지"`

### 3.3 커밋 시점 되돌리기 (Reset/Revert)
- **Reset (이력 삭제)**: 위험한 조작입니다. 커밋 자체를 지우고 싶을 때 사용합니다.
  ```bash
  git reset --hard <commit_id> # 특정 커밋 시점으로 완전히 복귀 (주의!)
  ```
- **Revert (이력 유지)**: 안전한 복구. 취소하려는 커밋을 역으로 실행하는 새 커밋을 생성합니다.
  ```bash
  git revert <commit_id>
  ```

---

## 4. 자주 발생하는 오류 및 해결법
- **Push rejected (Non-fast-forward)**: 원격 저장소와 로컬 저장소의 이력이 달라 발생합니다. `git pull`을 통해 먼저 동기화한 뒤 `git push`를 진행하세요.
- **Merge Conflict**: 충돌 난 파일을 열어 `<<<<<<<`, `=======`, `>>>>>>>` 영역을 수정하고 다시 `git add` -> `git commit` 하세요.
- **Detached HEAD**: 브랜치 이동이 아닌 커밋 ID로 이동했을 때 발생합니다. `git checkout main`으로 다시 브랜치로 복귀하세요.

---

## 5. GitHub Pages 호스팅 가이드
GitHub Pages를 통해 정적 웹 사이트를 호스팅할 수 있습니다.

1. **빌드 경로 설정**: 저장소의 `/dist` 또는 `/docs` 폴더에 빌드 결과물이 위치하도록 합니다.
2. **GitHub 설정**:
   - `Settings` > `Pages` > `Build and deployment` > `Source`에서 **Deploy from a branch** 선택.
   - `Branch`를 `main`으로 설정하고 폴더는 `/dist` (또는 지정 경로)를 선택합니다.
3. **배포**: 설정 저장 시 GitHub Action이 자동으로 사이트를 배포합니다.
   * *참고: 라우팅 오류 방지를 위해 빌드 시 상대 경로('./') 설정이 필수입니다.*

---

## 6. CHANGELOG 관리
- **커밋 코드**: 프로젝트 전체 작업은 `COMMIT_0000X` 코드를 부여합니다.
- **로그 파일**: `changelogs/commit_0000X.md`에 세부 내용을 기록하세요.
- **구조**:
  - 1. 아키텍처 리팩토링
  - 2. 신규 기능 구현
  - 3. UI/UX 개선
  - 4. 기타(빌드/문서화)
