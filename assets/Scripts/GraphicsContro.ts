import CustomPhysicsCollider from "./CustomPhysicsCollider";


const {property,ccclass} = cc._decorator;
@ccclass
export default class GraphicsControl extends cc.Component {
  
    graphics: cc.Graphics = null
    line_point:Array<cc.Vec2> = [];

    onLoad() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
        this.graphics = this.getComponent(cc.Graphics);
    }

    start() {
        this.onTouch();
    }
    onTouch()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_end, this);
    }
    offTouch()
    {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touch_end, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touch_end, this);
    }
    touch_start (event) {
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.graphics.moveTo(pos.x, pos.y);
        this.line_point.push(cc.v2(pos.x, pos.y));
    }
    touch_move (event) {
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.graphics.lineTo(pos.x, pos.y);
        this.line_point.push(cc.v2(pos.x, pos.y));
        this.graphics.stroke();
    }
    touch_end (event) {
        this.createRigibody();
        this.offTouch();
    }

    rigibodyLogic:cc.RigidBody = null;
    physicsLine:CustomPhysicsCollider = null;
    /**
     * 创建刚体
     * @param {number} dt
     */
    createRigibody () {
        // console.log(this.line_point);
        this.rigibodyLogic = this.addComponent(cc.RigidBody);
        this.rigibodyLogic.gravityScale = 2;
        
        this.physicsLine = this.addComponent(CustomPhysicsCollider);
        this.physicsLine.lineWidth = 10;//this.graphics.lineWidth;
        this.physicsLine.points = this.line_point;
        this.physicsLine.friction = 0.2;
        this.physicsLine.density = 1;
        this.physicsLine.apply();
    }
    checkIsCanDraw (lastPoint, nowPoint) {
        return lastPoint.sub(nowPoint).mag() >= 20;
    }


    update(dt) {

    }
}