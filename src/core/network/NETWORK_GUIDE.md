# 🌐 Network Infra 가이드

이 모듈은 다양한 프로토콜(HTTP, TCP, UDP, Socket.io)을 통한 외부 통신을 담당하는 인프라 계층입니다.

## 🛠 제공 클라이언트

| 클라이언트 | 프로토콜 | 주요 용도 | 비고 |
| :--- | :--- | :--- | :--- |
| **HttpClient** | HTTP/HTTPS | REST API 호출, JSON 데이터 송수신 | `axios` 기반 |
| **TcpClient** | TCP | 저수준 스트림 통신, 안정적 데이터 전송 | Node.js 전용 |
| **UdpClient** | UDP | 비연결형 빠른 패킷 전송, 실시간성 중요 작업 | Node.js 전용 |
| **SocketClient** | Socket.io | 실시간 양방향 이벤트 통신, 알림, 채팅 등 | `socket.io-client` 기반 |

---

## 🚀 사용 방법 (How to use)

모든 클라이언트는 DI 컨테이너에 등록되어 있으므로 필요한 서비스의 생성자에서 주입받아 사용합니다.

### 1. HttpClient (REST API)
```typescript
import { HttpClient } from './http.client.js';

export class MyService {
  constructor(private readonly http: HttpClient) {}
```

  public async fetchData() {
    const response = await this.http.get('/users');
    return response.data;
  }
}
```

### 2. TcpClient (TCP)
*⚠️ Node.js 환경(Main Process)에서만 작동합니다.*
```typescript
const tcp = container.get<TcpClient>('TcpClient');
await tcp.connect('127.0.0.1', 8080);
tcp.send('Hello Server');
tcp.onData((data) => console.log('Received:', data.toString()));
```

### 3. UdpClient (UDP)
```typescript
const udp = container.get<UdpClient>('UdpClient');
udp.send('Fast Message', 5000, '127.0.0.1');
udp.onMessage((msg, rinfo) => console.log(`From ${rinfo.address}: ${msg}`));
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
