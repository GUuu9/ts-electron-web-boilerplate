import { Node, Blackboard } from '../../../core/ai/base.js';
import { AimAction } from '../actions/aiming.actions.js';

export class AimingBehaviorTree {
    private blackboard: Blackboard;
    private root: Node;

    constructor(projectile: any, target: any, textObj: any, autoMove: boolean, autoRelocate: boolean) {
        this.blackboard = new Blackboard();
        this.blackboard.set('projectile', projectile);
        this.blackboard.set('target', target);

        this.root = new AimAction(projectile, target, textObj, autoMove, autoRelocate);
    }

    public setAutoMove(value: boolean) {
        (this.root as AimAction).setAutoMove(value);
    }

    public setAutoRelocate(value: boolean) {
        (this.root as AimAction).setAutoRelocate(value);
    }

    public update(speed: number) {
        this.blackboard.set('speed', speed);
        this.root.tick(this.blackboard);
    }
}
