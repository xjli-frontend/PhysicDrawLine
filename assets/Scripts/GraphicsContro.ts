import CustomPhysicsCollider from "./CustomPhysicsCollider";
import MainUi from "./MainUi";


const {property,ccclass} = cc._decorator;
@ccclass
export default class GraphicsControl extends cc.Component {
  
    path: cc.Graphics = null
    line_point:Array<cc.Vec2> = [];
    dashedPath: cc.Graphics = null
    onLoad() {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
        // this.graphics = this.getComponent(cc.Graphics);

        this.path = this.getComponent(cc.Graphics);
        this.path.strokeColor = cc.color(255, 0, 0);
        this.path.lineWidth = 4;

        let node = new cc.Node();
        this.node.addChild(node);
        this.dashedPath = node.addComponent(cc.Graphics);
        this.dashedPath.strokeColor = cc.color(0, 255, 0,100);
        this.dashedPath.lineWidth = 4;
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
        this.line_point = [];
        let x = event.getLocation().x;
        let y = event.getLocation().y;
        // let collider = cc.director.getPhysicsManager().testPoint(x,y);
        // if(collider){return};
        let pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.path.moveTo(pos.x, pos.y);
        this.line_point.push(cc.v2(pos.x, pos.y));
        this.flag = true;
        cc.log("touch_start")
    }

    flag:boolean = true;
    touch_move (event) {
        if(this.line_point.length<=0){
            return;
        }
        let touchLoc = event.getLocation();
        touchLoc = this.node.parent.convertToNodeSpaceAR(touchLoc);
        // let lastTouchLoc = this.line_point[this.line_point.length - 1];
        let lastTouchLoc = this.line_point[0];
        if (this.checkIsCanDraw(lastTouchLoc, touchLoc)) {
            // 射线检测
            // let result = cc.director.getPhysicsManager().rayCast(lastTouchLoc, touchLoc, cc.RayCastType.All);
            let result = cc.director.getPhysicsManager().rayCast( this.node.parent.convertToWorldSpaceAR(lastTouchLoc), event.getLocation(), cc.RayCastType.All);
            if (result.length <= 0 && this.flag) {
                cc.log(1)
                this.line_point.push(cc.v2(touchLoc.x, touchLoc.y));
                this.path.lineTo(touchLoc.x, touchLoc.y);
                // this.path.moveTo(touchLoc.x, touchLoc.y);
                this.path.stroke();
            } else if(result.length > 0 && this.flag){
                if(this.flag){
                    cc.log(2,result[0].point)
                    this.flag = false;
                    let endPos = this.node.parent.convertToNodeSpaceAR(cc.v2(result[0].point.x*0.999,result[0].point.y*0.999));
                    this.line_point.push(endPos);
                    this.path.lineTo(endPos.x,endPos.y);
                    this.path.stroke();


                    let dashEndPos = this.node.convertToNodeSpaceAR(result[0].point);
                    this.dashedPath.moveTo(dashEndPos.x,dashEndPos.y);
                    touchLoc = this.node.convertToNodeSpaceAR(event.getLocation());
                    this.dashedPath.lineTo(touchLoc.x,touchLoc.y);
                    // this.node.parent.parent.getChildByName("point").setPosition(result[0].point)
                    // this.node.parent.parent.getChildByName("point2").setPosition(touchLoc)
                    // this.node.parent.parent.getChildByName("point3").setPosition(lastTouchLoc)
                    this.dashedPath.stroke();
                }
            }else if(!this.flag){
                cc.log(3)
                touchLoc = this.node.convertToNodeSpaceAR(event.getLocation());
                this.dashedPath.lineTo(touchLoc.x, touchLoc.y);
                this.dashedPath.stroke();

            }
            
        }
    }
    touch_end (event) {
        if(this.line_point.length<=0){
            return;
        }
        this.createRigibody();
        this.dashedPath.clear();
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
        this.physicsLine.lineWidth = this.path.lineWidth;
        this.physicsLine.points = this.line_point;
        this.physicsLine.friction = 1;
        this.physicsLine.density = 2;
        this.physicsLine.apply();
    }

    
    // // 每次将要处理碰撞体接触逻辑时被调用
    // onPreSolve(contact, selfCollider, otherCollider) {
    //     contact
    // }

    checkIsCanDraw (lastPoint, nowPoint) {
        return lastPoint.sub(nowPoint).mag() >= 20;
    }


    update(dt) {

    }
}