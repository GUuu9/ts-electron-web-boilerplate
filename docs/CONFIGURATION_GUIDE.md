# 프로젝트 설정 및 사용자 정의 가이드

본 문서는 애플리케이션의 제품명, 패키지 정보, 아이콘 및 설명을 변경하는 방법을 설명합니다.

---

## 1. 프로젝트 메타데이터 수정

### 1.1 `package.json`
애플리케이션의 이름과 설명을 수정하려면 `package.json` 파일을 편집하십시오.
- `name`: 프로젝트 내부 식별자 (영어, 소문자, 하이픈 사용).
- `productName`: OS에서 표시되는 실제 앱 이름.
- `description`: 프로젝트의 짧은 설명.

```json
{
  "name": "your-app-id",
  "productName": "My Awesome App",
  "description": "앱에 대한 상세 설명"
}
```

### 1.2 `electron-builder` 설정 (빌드 시)
실제 OS 배포 파일(exe, dmg 등)에 적용되는 이름은 `electron-builder` 설정 파일(`package.json` 내 `build` 섹션 또는 `electron-builder.yml`)에서 관리됩니다.

---

## 2. 아이콘 변경

### 2.1 데스크탑 아이콘 (Electron)
Electron 애플리케이션의 아이콘은 OS별 표준 규격을 따라야 합니다. `build/` 폴더를 확인하십시오.
- **Mac**: `build/icon.icns` 파일 교체.
- **Windows**: `build/icon.ico` 파일 교체.

### 2.2 웹 아이콘 (Favicon)
웹 환경(Vite)에서 표시되는 파비콘은 다음 경로의 파일을 교체합니다.
- `public/favicon.ico`

> **주의**: 아이콘 교체 후 빌드 캐시를 지우고 다시 빌드(`npm run build`)하여 변경사항을 반영하십시오.

---

## 3. 웹 애플리케이션 상세 설명
- **`README.md`**: 프로젝트 루트의 README 파일을 수정하여 프로젝트 전체에 대한 소개를 업데이트하십시오.
- **`index.html`**: `<title>` 태그를 수정하여 브라우저 탭에 표시되는 이름을 변경하십시오.

```html
<title>내 앱 이름 - 대시보드</title>
```

---

## 4. 변경 후 적용 단계
1. 위의 파일들을 수정합니다.
2. 의존성을 삭제하고 다시 설치합니다.
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. 프로젝트를 다시 빌드하여 변경된 설정이 적용되었는지 확인합니다.
   ```bash
   npm run build:web
   npm run build:electron
   ```
