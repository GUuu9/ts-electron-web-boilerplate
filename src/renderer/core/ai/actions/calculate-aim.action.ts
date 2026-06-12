import { Blackboard, NodeStatus, BaseAction } from '../../../../shared/core/ai/base.js';

/**
 * 타겟과의 거리에 따라 힘(Power)을, 위치에 따라 각도를 계산합니다.
 */
export class CalculateAimAction extends BaseAction {
  run(blackboard: Blackboard): NodeStatus {
    const target = blackboard.get('targetPos');
    const start = { x: 100, y: 500 };

    if (!target) return NodeStatus.Failure;

    // 거리 계산
    const dx = target.x - start.x;
    const dy = target.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    blackboard.set('lastDistance', distance); // 거리를 저장하여 ViewModel에서 사용

    // 각도 계산
    let angle = Math.atan2(dy, dx);
    
    // 메모리(기억)를 참조하여 bias 적용
    const memory: { distance: number, bias: number }[] = blackboard.get('memory') || [];
    let bias = blackboard.get('aimBias') || 0;

    // 현재 거리와 비슷한 과거 명중 데이터가 있으면 bias를 반영
    const similarMemory = memory.find(m => Math.abs(m.distance - distance) < 50);
    if (similarMemory) {
        // 학습 효과: 기존 bias에 새로운 데이터를 반영하여 점진적으로 보정
        bias = (bias * 0.7) + (similarMemory.bias * 0.3);
    }
    
    angle += bias;
    blackboard.set('aimBias', bias); // bias 유지

    // 거리에 따른 힘 계산 (멀수록 힘을 증가)
    // 200~800 거리 기반으로 300~600 힘 적용
    const minDistance = 200;
    const maxDistance = 800;
    const minForce = 350; // 조금 더 보정
    const maxForce = 650;
    
    let force = minForce + ((distance - minDistance) / (maxDistance - minDistance)) * (maxForce - minForce);
    force = Math.max(minForce, Math.min(maxForce, force));

    blackboard.set('aimAngle', angle);
    blackboard.set('aimForce', force);
    
    // 로그 출력 빈도 제한 (5% 확률)
    if (Math.random() < 0.05) {
      console.log(`[AI] 타겟 위치: (${target.x.toFixed(0)}, ${target.y.toFixed(0)}), 조준 각도: ${angle.toFixed(2)}, 오차 보정: ${bias.toFixed(2)}`);
    }
    
    return NodeStatus.Success;
  }
}
