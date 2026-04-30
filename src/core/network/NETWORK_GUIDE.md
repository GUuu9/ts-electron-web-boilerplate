# 🌐 Network Infra 가이드

이 모듈은 다양한 프로토콜(HTTP, Socket.io)을 통한 외부 통신을 담당하는 인프라 계층입니다.

## 🛠 제공 클라이언트

| 클라이언트 | 프로토콜 | 주요 용도 | 비고 |
| :--- | :--- | :--- | :--- |
| **HttpClient** | HTTP/HTTPS | REST API 호출, JSON 데이터 송수신 | `axios` 기반 |
| **SocketClient** | Socket.io (C) | 실시간 양방향 이벤트 통신 (Client) | `socket.io-client` |
| **SocketServer** | Socket.io (S) | 실시간 통신 서버 운영 (Broadcast 지원) | **신규 추가** |

---

## 🚀 사용 방법 (How to use)

### 1. Socket.io Server (실시간 서버)
*⚠️ Node.js 환경(Main Process)에서만 작동합니다.*
```typescript
const socketServer = container.get<SocketServer>('SocketServer');
await socketServer.listen(3000, (clientId, event, data) => {
  console.log(`Event [${event}] from ${clientId}:`, data);
});
socketServer.broadcast('notice', { msg: 'Welcome!' });
```

### 2. SocketClient (Real-time)
```typescript
const socket = container.get<SocketClient>('SocketClient');
socket.connect('http://localhost:3001');
socket.emit('chat message', 'Hello!');
socket.on('response', (data) => console.log(data));
```

---

## 📂 파일 구조

- `http.client.ts`: Axios 기반의 공통 요청/응답 처리
- `socket.client.ts`: Socket.io 클라이언트 래퍼
- `socket.server.ts`: Socket.io 서버 래퍼
