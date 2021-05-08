
const {property,ccclass} = cc._decorator;
@ccclass
export default class CustomPhysicsCollider extends cc.PhysicsCollider {

    lineWidth:number= 10;
    points:Array<cc.Vec2> = [];
    _createShape (scale) {
        var shapes = [];

        var polys = this.points;
        // console.log(polys);
        var polyIdx = 0;
        for (var i = 0; i < polys.length - 1; i++) {
            var posBegin = polys[i];
            var posEnd = polys[i + 1];
            var linelen = posBegin.sub(posEnd).mag();

            var angle = Math.atan2(posEnd.y - posBegin.y, posEnd.x - posBegin.x) - Math.PI / 2;

            var midPos = posBegin.add(posEnd).mul(0.5);

            var shape = new b2.PolygonShape();

            if(posBegin.equals(posEnd)){
                continue;
            }

            if (shape) {
                shape.SetAsBox(this.lineWidth / 2 / 32, linelen / 2 / 32 , new b2.Vec2(midPos.x / 32, midPos.y / 32), angle);
    
                shapes.push(shape);
            }
        }

        return shapes;
    }
}