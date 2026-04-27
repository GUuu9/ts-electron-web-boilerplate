# 🔐 Security & Compression 가이드 (Shared)

이 모듈은 애플리케이션 전반에서 사용되는 보안 기능(암호화, 키 교환)과 데이터 효율화(압축)를 담당하는 핵심 인프라입니다.

## 💡 설계 원칙

1.  **플랫폼 독립성**: Node.js와 Browser 환경에서 공통으로 지원하는 표준 Web Crypto API와 CompressionStream API를 사용하여 외부 라이브러리 의존성 없이 작동합니다.
2.  **보안 표준 준수**: AES-256-GCM(무결성 보장 암호화) 및 RSA-OAEP(최신 비대칭 암호화)를 기본으로 채택합니다.
3.  **유연한 압축**: 전송 환경에 맞춰 Gzip, Deflate, Raw Deflate 방식을 선택할 수 있습니다.

---

## 🚀 주요 기능 및 사용 방법

### 1. AES-256-GCM (대칭키 암호화)
데이터의 기밀성과 무결성을 동시에 보장합니다.

```typescript
const security = new SecurityService();
const key = "32바이트_길이의_비밀키_문자열_사용";

// 암호화
const encrypted = await security.aesEncrypt("평문 메시지", key);
// 결과 형식: "iv:ciphertext" (Auth Tag는 데이터 끝에 포함)

// 복호화
const decrypted = await security.aesDecrypt(encrypted, key);
```

### 2. RSA-OAEP (비대칭키 키 교환)
안전한 세션 키 교환을 위해 사용됩니다.

```typescript
// 1. 키쌍 생성 (1024, 2048, 4096 bits 지원)
const { publicKey, privateKey } = await security.rsaGenerateKeyPair(2048);

// 2. HEX를 PEM 포맷으로 변환 (UI 표시용)
const pubPem = security.hexToPem(publicKey, 'PUBLIC KEY');
const privPem = security.hexToPem(privateKey, 'PRIVATE KEY');

// 3. 공개키로 암호화 (송신자)
const encrypted = await security.rsaEncrypt("Secret Data", publicKey);

// 3. 개인키로 복호화 (수신자)
const decrypted = await security.rsaDecrypt(encrypted, privateKey);
```

### 3. Data Compression (압축)
네트워크 전송량 감소를 위해 사용합니다.

```typescript
// 압축 (gzip, deflate, deflate-raw 지원)
const compressed = await security.compress("긴 텍스트 데이터", "gzip");

// 해제
const original = await security.decompress(compressed, "gzip");
```

---

## 🛠 기술 사양

| 구분 | 알고리즘 / 표준 | 상세 정보 |
| :--- | :--- | :--- |
| **Symmetric** | AES-256-GCM | 256-bit Key, 96-bit IV, 128-bit Auth Tag |
| **Asymmetric** | RSA-OAEP | 2048-bit (Recommended), SHA-256 Hash |
| **Compression** | RFC 1950/1951/1952 | Gzip, Deflate, Deflate-Raw |

---

## ⚠️ 주의 사항
- **AES 키 길이**: 반드시 32바이트(256비트)를 준수해야 합니다.
- **비동기 처리**: 모든 보안 및 압축 로직은 성능을 위해 `Promise` 기반으로 작동하므로 `await` 사용이 필수입니다.
- **환경 제한**: 최신 브라우저 및 Node.js v18 이상 환경을 요구합니다.
