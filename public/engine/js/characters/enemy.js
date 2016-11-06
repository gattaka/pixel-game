var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lich;
(function (Lich) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(maxHorizontalSpeed, maxVerticalSpeed, damage, attackCooldown, width, height, collXOffset, collYOffset, animationKey, initState, frames, animations) {
            _super.call(this, width, height, collXOffset, collYOffset, animationKey, initState, frames, animations);
            this.currentAttackCooldown = 0;
        }
        return Enemy;
    }(Lich.Character));
    Lich.Enemy = Enemy;
})(Lich || (Lich = {}));
