

const {property,ccclass} = cc._decorator;

@ccclass
export default class MainUi extends cc.Component{

    //绘制界面
    @property(cc.Prefab)
    graphics: cc.Prefab = null;
    @property(cc.PhysicsBoxCollider)
    leftBian: cc.PhysicsBoxCollider = null;
    @property(cc.PhysicsBoxCollider)
    rightBian: cc.PhysicsBoxCollider = null;
    @property(cc.PhysicsBoxCollider)
    downBian: cc.PhysicsBoxCollider = null;


    onLoad() {
        // window.mainUi = this;

        //开启物理
        var manager = cc.director.getPhysicsManager();
        manager.enabled = true;

        //绘制物理信息
        manager.debugDrawFlags = 
            // 0;
            cc.PhysicsManager.DrawBits.e_jointBit |
            cc.PhysicsManager.DrawBits.e_shapeBit;

        //注册
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end, this);
    }

    start() {

        this.downBian.node.setPosition(cc.v2(0, -cc.winSize.height / 2));
        // this.downBian.editing = true;
        this.downBian.size =new  cc.Size(cc.winSize.width,10);

        this.leftBian.node.setPosition(cc.v2(-cc.winSize.width / 2 + this.leftBian.size.width, 0));

        this.rightBian.node.setPosition(cc.v2((cc.winSize.width / 2 - this.rightBian.size.width, 0)));

        //先准备好一个绘制界面
        this.createGraphics();
    }
    touch_start (event) {
    }
    touch_move (event) {
    }
    touch_end (event) {

        //每次画完在准备好一个绘制界面
        this.createGraphics();
    }
    createGraphics() {
        var graphics_node = cc.instantiate(this.graphics);
        console.log("~~~~~~~~~~~~~~",graphics_node);
        graphics_node.x = 0;
        this.node.addChild(graphics_node);
    }
    update(dt) { 
        
    }
}