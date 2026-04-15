# 🏗 Dependency Injection (DI) 가이드

이 모듈은 애플리케이션의 **의존성 주입(Dependency Injection)**과 **객체 생명주기**를 중앙에서 관리하는 핵심 인프라입니다.

## 💡 설계 원칙

1. **싱글톤(Singleton) 관리**: 모든 서비스와 컨트롤러는 단일 인스턴스로 생성되어 메모리 효율을 높입니다.
2. **제어의 역전(IoC)**: 클래스가 스스로 의존 객체를 생성하지 않고, 컨테이너로부터 주입받음으로써 결합도를 낮춥니다.
3. **중앙 집중식 등록**: `container.ts` 한 곳에서 모든 의존성 관계를 정의하여 추적을 용이하게 합니다.

---

## 🚀 사용 방법 (How to use)

새로운 기능을 추가할 때 다음 3단계를 따릅니다.

### 1. 클래스 정의 (생성자 주입)
새로운 클래스를 만들 때, 필요한 의존성을 생성자의 매개변수로 정의합니다.

```typescript
// 예: MyService.ts
export class MyService {
  public doWork() { /* ... */ }
}

// 예: MyController.ts
export class MyController {
  constructor(private readonly myService: MyService) {}
}
```

### 2. 컨테이너 등록 (`container.ts`)
`DIContainer`의 생성자에서 인스턴스를 생성하고 `Map`에 등록합니다.

```typescript
// src/core/di/container.ts
private constructor() {
  // 서비스 생성
  const myService = new MyService();
  this.services.set('MyService', myService);

  // 컨트롤러 생성 (서비스 주입)
  const myController = new MyController(myService);
  this.services.set('MyController', myController);
}
```

### 3. 인스턴스 사용
필요한 곳에서 `container.get()`을 통해 인스턴스를 가져옵니다.

```typescript
import { container } from '@/core/di';

const controller = container.get<MyController>('MyController');
controller.handleRequest();
```

---

## 📂 파일 구조

- `index.ts`: 배럴(Barrel) 내보내기 파일. 외부에서는 이 파일을 통해 접근합니다.
- `container.ts`: 실제 객체 생성 및 관리 로직이 포함된 클래스입니다.

---

## ⚠️ 주의 사항
- 컨테이너에 등록되지 않은 키(Key)로 요청할 경우 에러가 발생합니다.
- 순환 참조(Circular Dependency)가 발생하지 않도록 설계 시 주의하십시오.
