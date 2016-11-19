var Lich;
(function (Lich) {
    (function (CharacterState) {
        CharacterState[CharacterState["WALKR"] = 0] = "WALKR";
        CharacterState[CharacterState["WALKL"] = 1] = "WALKL";
        CharacterState[CharacterState["IDLE"] = 2] = "IDLE";
        CharacterState[CharacterState["BREATH"] = 3] = "BREATH";
        CharacterState[CharacterState["JUMP"] = 4] = "JUMP";
        CharacterState[CharacterState["JUMPR"] = 5] = "JUMPR";
        CharacterState[CharacterState["JUMPL"] = 6] = "JUMPL";
        CharacterState[CharacterState["MIDAIR"] = 7] = "MIDAIR";
        CharacterState[CharacterState["FALL"] = 8] = "FALL";
        CharacterState[CharacterState["DIE"] = 9] = "DIE";
        CharacterState[CharacterState["DEAD"] = 10] = "DEAD";
        CharacterState[CharacterState["TELEPORT"] = 11] = "TELEPORT";
        CharacterState[CharacterState["CLIMB"] = 12] = "CLIMB";
    })(Lich.CharacterState || (Lich.CharacterState = {}));
    var CharacterState = Lich.CharacterState;
})(Lich || (Lich = {}));
