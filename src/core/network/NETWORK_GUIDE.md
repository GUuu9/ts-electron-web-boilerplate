# 🌐 Network Infra 가이드

이 모듈은 다양한 프로토콜(HTTP, TCP, UDP, Socket.io)을 통한 외부 통신을 담당하는 인프라 계층입니다.

## 🛠 제공 클라이언트

| 클라이언트 | 프로토콜 | 주요 용도 | 비고 |
| :--- | :--- | :--- | :--- |
| **HttpClient** | HTTP/HTTPS | REST API 호출, JSON 데이터 송수신 | `axios` 기반 |
| **TcpClient** | TCP (Client) | 저수준 스트림 통신, 안정적 데이터 전송 | Node.js 전용 |
| **TcpServer** | TCP (Server) | 특정 포트 리슨, 멀티 클라이언트 관리 | **신규 추가** |
| **UdpClient** | UDP | 비연결형 빠른 패킷 전송 (Bind/Unbind 지원) | **해제 기능 추가** |
| **SocketClient** | Socket.io (C) | 실시간 양방향 이벤트 통신 (Client) | `socket.io-client` |
| **SocketServer** | Socket.io (S) | 실시간 통신 서버 운영 (Broadcast 지원) | **신규 추가** |

---

## 🚀 사용 방법 (How to use)

### 1. TCP Server (서버 운영)
*⚠️ Node.js 환경(Main Process)에서만 작동합니다.*
```typescript
const tcpServer = container.get<TcpServer>('TcpServer');
await tcpServer.listen(8888, (clientId, data) => {
  console.log(`From ${clientId}:`, data.toString());
});
tcpServer.broadcast('Hello All Clients!');
```

### 2. Socket.io Server (실시간 서버)
*⚠️ Node.js 환경(Main Process)에서만 작동합니다.*
```typescript
const socketServer = container.get<SocketServer>('SocketServer');
await socketServer.listen(3000, (clientId, event, data) => {
  console.log(`Event [${event}] from ${clientId}:`, data);
});
socketServer.broadcast('notice', { msg: 'Welcome!' });
```

### 3. UDP Bind & Close
```typescript
const udp = container.get<UdpClient>('UdpClient');
udp.bind(5001); // 수신 시작
// ...
udp.close(); // 소켓 닫기 및 포트 해제
```

```

### 4. SocketClient (Real-time)
```typescript
const socket = container.get<SocketClient>('SocketClient');
socket.connect('http://localhost:3001');
socket.emit('chat message', 'Hello!');
socket.on('response', (data) => console.log(data));
```

---

## 📂 파일 구조

- `http.client.ts`: Axios 기반의 공통 요청/응답 처리
- `tcp.client.ts`: Node.js net 모듈 래퍼
- `udp.client.ts`: Node.js dgram 모듈 래퍼
- `socket.client.ts`: Socket.io 클라이언트 래퍼
- `index.ts`: 배럴 내보내기
