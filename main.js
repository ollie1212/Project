var userWeapon = "";
var actionArray = ["attack", "run", "talk"];
var keywordArray = ["inventory", "status", "enemy", "health"];
var userAction = "";
var userCheckKeyword = "";

function actor(Name, Health, Level) {
    this.Name = Name;
    this.Health = Health;
    this.Level = Level;
}

var newUser = new actor("you", 200, 1);
var monsters = [
    new actor("skeleton", 40, 1),
    new actor("wolf", 60, 1),
    new actor("highwayman", 200, 3),
    new actor("hobb", 120, 2)];

function prefix(Name, DamageMod) {
    this.Name = Name;
    this.DamageMod = DamageMod;
}

var weaponPrefix = [
	new prefix("common", 1),
	new prefix("rusty", 0.6),
	new prefix("refined", 1.2),
	new prefix("legendary", 1000)
];

function weapons(Name, Damage, Prefix) {
    this.Name = Name;
    this.Damage = Damage;
    this.Prefix = weaponPrefix[0];
}

var weapon = [
	new weapons("sword", 15, weaponPrefix[0]),
	new weapons("halberd", 25, weaponPrefix[0]),
	new weapons("rapier", 10, weaponPrefix[0]),
	new weapons("claymore", 20, weaponPrefix[0])
];


function action() {
    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");

    for (var i = 0; i < strArray.length; i++) {
        for (var j = 0; j < weapon.length; j++) {
            if (strArray[i] == weapon[j].Name) {
                userWeapon = strArray[i];

            }
        }
    }

    for (var i = 0; i < strArray.length; i++) {
        for (var j = 0; j < actionArray.length; j++) {
            if (strArray[i] == actionArray[j]) {
                userAction = strArray[i];
            }
        }
    }


    for (var i = 0; i < strArray.length; i++) {
        if (strArray[i] == "check") {
            for (var i = 0; i < strArray.length; i++) {
                for (var j = 0; j < keywordArray.length; j++) {

                    if (strArray[i] == keywordArray[j]) {
                        userCheckKeyword = strArray[i];

                        switch (userCheckKeyword) {

                            case "status":
                                userStatus();
                                break;

                            case "inventory":
                                userInventory();
                                break;

                            case "enemy":
                                enemy();
                                break;

                            case "health":
                                userHealth();
                                break;

                        }
                    }
                }

            }
        }
    }

    writeToTextArea("" + actor.Name + " " + userAction + " with " + userWeapon);

}

function writeToTextArea(string) {
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}

//function userStatus()
//{
//writeToTextArea("Your Current level is: " + newUser.Name);

//}
