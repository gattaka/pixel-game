var Lich;
(function (Lich) {
    var CharacterState;
    (function (CharacterState) {
        CharacterState[CharacterState["WALKR"] = 0] = "WALKR";
        CharacterState[CharacterState["WALKL"] = 1] = "WALKL";
        CharacterState[CharacterState["IDLE"] = 2] = "IDLE";
        CharacterState[CharacterState["JUMP"] = 3] = "JUMP";
        CharacterState[CharacterState["JUMPR"] = 4] = "JUMPR";
        CharacterState[CharacterState["JUMPL"] = 5] = "JUMPL";
        CharacterState[CharacterState["MIDAIR"] = 6] = "MIDAIR";
        CharacterState[CharacterState["FALL"] = 7] = "FALL";
        CharacterState[CharacterState["DIE"] = 8] = "DIE";
        CharacterState[CharacterState["DEAD"] = 9] = "DEAD";
    })(CharacterState || (CharacterState = {}));
})(Lich || (Lich = {}));
