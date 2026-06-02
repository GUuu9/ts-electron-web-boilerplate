# 🐍 Python 가상 환경 (venv) 활용 가이드

본 프로젝트는 Node.js 기반이지만, 네이티브 모듈 컴파일 및 다양한 자동화 도구의 안정적인 동작을 위해 **Python 가상 환경(venv)**을 사용합니다.

---

## 💡 venv를 사용하는 이유

1.  **컴파일 안정성**: Electron의 네이티브 모듈 빌드 도구인 `node-gyp`는 Python을 필요로 합니다. 가상 환경을 통해 시스템 전역 Python 설정과 독립된 안정적인 빌드 환경을 유지합니다.
2.  **의존성 격리**: 프로젝트 전용 Python 라이브러리들을 설치해도 다른 프로젝트나 시스템 환경에 영향을 주지 않습니다.
3.  **일관된 개발 환경**: 모든 개발자가 동일한 버전의 빌드 도구를 사용할 수 있도록 보장합니다.
---
 
## 🚀 사용 방법

### 0. 가상 환경 생성 (최초 1회 또는 재구축 시)
`venv` 폴더가 없는 경우, 아래 명령어를 통해 프로젝트 전용 가상 환경을 먼저 생성해야 합니다.
```bash
# 프로젝트 루트에서 실행
python3 -m venv venv
```
이후 아래의 활성화 단계를 진행하세요.

### 1. 가상 환경 활성화 (작업 시작 시)
가상 환경이 생성된 상태에서, 터미널 세션마다 한 번씩 실행하여 현재 터미널에 환경을 적용합니다.
```bash
# macOS / Linux
source venv/bin/activate
...
```

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Windows (Command Prompt)
.\venv\Scripts\activate.bat
```

활성화되면 터미널 프롬프트 앞에 `(venv)` 표시가 나타납니다.

### 2. 가상 환경 비활성화 (작업 종료 시)
작업이 끝난 후 시스템 전역 환경으로 돌아가려면 다음 명령어를 입력하세요.

```bash
deactivate
```

---

## 🛠 유지보수 및 팁

### 새로운 패키지 설치
프로젝트에 필요한 새로운 Python 도구가 있다면 가상 환경이 **활성화된 상태**에서 설치하세요.
```bash
pip install [패키지명]
```

### 환경 재구축
만약 `venv` 폴더가 깨지거나 다시 설정해야 한다면 폴더를 삭제하고 다시 생성하세요.
```bash
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
```

---

## ⚠️ 주의 사항
- **`.gitignore`**: `venv` 폴더는 용량이 크고 환경 의존적이므로 절대 Git에 커밋하지 않습니다. (이미 설정 완료)
- **자동 활성화**: VS Code를 사용하신다면, Python 인터프리터를 프로젝트 루트의 `venv`로 설정하면 터미널 열기 시 자동으로 활성화됩니다.