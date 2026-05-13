import { Node, Blackboard, NodeStatus } from '../../../core/ai/base.js';

export class AimAction extends Node {
  private gravity = 0.15;
  private memory: Map<string, { angle: number; power: number; weight: number }> = new Map();
  private readonly MAX_MEMORY_SIZE = 500;
  private readonly MAX_POWER = 20;

  private currentAngle: number = 0;
  private currentPower: number = 10;

  constructor(
    private projectile: any, 
    private target: any, 
    private textObj: any, 
    private autoMove: boolean = true,
    private autoRelocate: boolean = true
  ) {
    super();
    this.memory = new Map();
    this.projectile.startX = projectile.x;
    this.projectile.startY = projectile.y;
    this.projectile.velocity = { x: 0, y: 0 };
  }

  public setAutoMove(value: boolean) { this.autoMove = value; }
  public setAutoRelocate(value: boolean) { this.autoRelocate = value; }

  private getKey(x: number, y: number): string {
    return `${Math.floor(x / 40) * 40}:${Math.floor(y / 40) * 40}`;
  }

  public tick(blackboard: Blackboard, speed: number = 1.0): NodeStatus {
    // 0. 타겟 이동
    if (this.autoMove) {
        if (!this.target.vx || (this.target.vx === 0 && this.target.vy === 0)) { 
            this.target.vx = (Math.random() - 0.5) * 4; 
            this.target.vy = (Math.random() - 0.5) * 4; 
        }
        this.target.x += this.target.vx * speed;
        this.target.y += this.target.vy * speed;
        if (this.target.x < 50 || this.target.x > 750) this.target.vx *= -1;
        if (this.target.y < 50 || this.target.y > 500) this.target.vy *= -1;
    }

    // 1. 발사 로직
    if (this.projectile.velocity.x === 0 && this.projectile.velocity.y === 0) {
      let targetX = this.target.x;
      let targetY = this.target.y;

      if (this.autoMove) {
        const dist = Math.sqrt(Math.pow(this.target.x - this.projectile.startX, 2) + Math.pow(this.target.y - this.projectile.startY, 2));
        const flightTime = dist / 10;
        targetX += (this.target.vx || 0) * flightTime;
        targetY += (this.target.vy || 0) * flightTime;
      }
      
      const key = this.getKey(targetX, targetY);
      const learned = this.memory.get(key);

      if (learned && learned.weight > 1) {
        this.currentAngle = learned.angle;
        this.currentPower = learned.power;
        this.projectile.fillColor = 0x2ecc71;
      } else {
        // 학습되지 않은 구간 혹은 실패 후 삭제된 구간: 새로운 랜덤값 탐색
        const dx = targetX - this.projectile.startX;
        const dy = targetY - this.projectile.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // 타겟 방향으로의 기본 각도에 랜덤 변수 추가
        this.currentAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
        this.currentPower = Math.min(Math.max(2, (dist * 0.05) + (Math.random() - 0.5) * 3), this.MAX_POWER);
        this.projectile.fillColor = 0x3498db;
      }
      
      this.projectile.x = this.projectile.startX;
      this.projectile.y = this.projectile.startY;
      this.projectile.velocity = { x: Math.cos(this.currentAngle) * this.currentPower, y: Math.sin(this.currentAngle) * this.currentPower };
    }

    // 2. 물리 적용
    this.projectile.velocity.y += this.gravity * speed;
    this.projectile.x += this.projectile.velocity.x * speed;
    this.projectile.y += this.projectile.velocity.y * speed;
    
    if (this.projectile.x < 20 || this.projectile.x > 780) { this.projectile.velocity.x *= -0.8; this.projectile.x = Math.max(20, Math.min(780, this.projectile.x)); }
    if (this.projectile.y < 20 || this.projectile.y > 580) { 
        this.projectile.velocity.y *= -0.8; 
        this.projectile.y = Math.max(20, Math.min(580, this.projectile.y)); 
    }

    // 3. 판정 및 학습
    const distToTarget = Math.sqrt(Math.pow(this.projectile.x - this.target.x, 2) + Math.pow(this.projectile.y - this.target.y, 2));
    if (distToTarget < 25 || this.projectile.y >= 580) {
      const key = this.getKey(this.target.x, this.target.y);
      
      if (distToTarget < 25) {
          // 명중 시: 데이터 갱신 (가중치 상승)
          const existing = this.memory.get(key);
          const w = existing ? Math.min(existing.weight + 1, 10) : 1;
          this.memory.set(key, { angle: this.currentAngle, power: this.currentPower, weight: w });
          
        if (this.autoRelocate) {
          this.target.x = 200 + Math.random() * 500; 
          this.target.y = 100 + Math.random() * 400;
        }
      } else {
        // 명중 실패 시: 데이터 삭제 (다음에 다시 랜덤하게 시도하게 함)
        this.memory.delete(key);
      }
      
      this.projectile.velocity = { x: 0, y: 0 };
      this.projectile.x = this.projectile.startX;
      this.projectile.y = this.projectile.startY;
    }
    
    this.textObj.setText(`Angle: ${(this.currentAngle * 180 / Math.PI).toFixed(1)}° | Power: ${this.currentPower.toFixed(1)} | Learned: ${this.memory.size}`);
    return NodeStatus.RUNNING;
  }
}
