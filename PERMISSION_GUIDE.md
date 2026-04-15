# 🔒 OS별 권한 설정 가이드 (Network Permissions)

이 프로젝트는 다양한 네트워크 통신(HTTP, TCP, UDP, Socket.io)을 사용하므로, 각 운영체제별로 적절한 보안 권한 설정이 필요합니다.

---

## 🍎 macOS (App Sandbox)

macOS 앱은 보안을 위해 **Sandbox** 환경에서 실행됩니다. 네트워크 접근을 위해 다음 설정이 `build/entitlements.mac.plist`에 정의되어 있습니다.

- **com.apple.security.network.client**: 외부 API 호출(HTTP, Socket.io) 시 필수.
- **com.apple.security.network.server**: TCP/UDP 서버 소켓을 열거나 들어오는 연결을 받을 때 필수.

### ⚠️ 주의 사항
- 앱을 실제로 배포(Sign & Notarize)할 때 이 권한이 없으면 네트워크 통신이 모두 차단됩니다.
- 개발 모드(`npm run electron:dev`)에서는 일반적으로 허용되나, 빌드 후 실행 파일(`.dmg`)에서는 반드시 체크해야 합니다.

---

## 🪟 Windows (Firewall)

Windows는 별도의 권한 파일 대신 **방화벽(Firewall)** 시스템이 네트워크를 제어합니다.

- **첫 실행 시 알림**: 앱이 처음으로 TCP/UDP 통신을 시도할 때 "Windows 보안 경고" 팝업이 뜹니다. 이때 **[액세스 허용]**을 눌러야 통신이 가능합니다.
- **관리자 권한**: 1024번 이하의 Well-known 포트(예: HTTP 80, HTTPS 443)를 서버로 사용하려면 관리자 권한으로 앱을 실행해야 할 수 있습니다.

---

## 🐧 Linux (Cap_Net_Bind_Service)

리눅스는 일반적으로 네트워크 접근이 자유롭지만, 다음 상황에서는 특별한 권한이 필요합니다.

- **낮은 포트 사용**: 1024번 미만의 포트를 서버로 열고 싶다면 `sudo` 권한이 필요하거나, `setcap` 명령어를 통해 실행 파일에 권한을 부여해야 합니다.
  ```bash
  sudo setcap 'cap_net_bind_service=+ep' /path/to/your/app
  ```

---

## 🛠 공통 권한 문제 해결 (Troubleshooting)

1. **로컬 호스트(localhost) 통신 안됨**:
   - macOS 샌드박스 설정에서 `com.apple.security.network.server`가 `true`인지 확인하세요.
2. **빌드 후 갑자기 네트워크가 안됨**:
   - `package.json`의 `entitlements` 경로가 올바른지, 실제 빌드 시 서명이 제대로 되었는지 확인하세요.
