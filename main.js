// JavaScript source code
var userWeapon = "";
var chosenMonster = "";
var count = 0;
var monstersKilled = [];

var actionArray = [
{ Name: "attack", DamageMulti: 1.2 },
{ Name: "Slash", DamageMulti: 1.1 },
{ Name: "talk", DamageMulti: 0.8 }
];

//stores all the directions the user can take 
var directions = [
    { name: "north", XAxis: 0, YAxis: 1 },
    { name: "east", XAxis: 1, YAxis: 0 },
    { name: "south", XAxis: 0, YAxis: -1 },
    { name: "west", XAxis: -1, YAxis: 0 },
]

var keywordArray = ["inventory", "status", "enemy", "health"];
var userAction = "";
var userCheckKeyword = "";

function coOrdinates(Xaxis, Yaxis) {
    this.Xaxis = Xaxis;
    this.Yaxis = Yaxis;
}


function actor(Name, Health, MaxHealth, Level, EXP, MaxEXP, CoOrdinates, MonDamage) {
    this.Name = Name;
    this.Health = Health;
    this.MaxHealth = MaxHealth;
    this.Level = Level;
    this.EXP = EXP;
    this.MaxEXP = MaxEXP;
    this.CoOrdinates = new coOrdinates(0, 0);
    this.MonDamage = MonDamage;
}

var newUser = new actor("you", 200, 200, 1, 0, 20, coOrdinates(0, 0), 0);
var monsters = [
    new actor("skeleton", 40, 40, 1, 15, 15, 0, 5),
    new actor("wolf", 60, 60, 1, 20, 20, 0, 15),
    new actor("highwayman", 200, 200, 3, 40, 40, 0, 40),
    new actor("hobb", 120, 120, 2, 30, 30, 0, 30)
];

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
    this.Prefix = new prefix("devNULL", 1);
}

var weapon = [
	new weapons("sword", 15, weaponPrefix[0]),
	new weapons("halberd", 25, weaponPrefix[0]),
	new weapons("rapier", 10, weaponPrefix[0]),
	new weapons("claymore", 20, weaponPrefix[0])
];

var items = [
    { Name: "painkiller", Inventory: 3, Value: 50 },
    { Name: "adrenaline", Inventory: 1, Value: 150 },
]

function start() {
    writeToTextArea("Welcome to Our Text Based Adventure Game!");
    spawnMonster();
}


function action()
{
    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");
    if (count == 0)
    {
        currentMonsterHealth = chosenMonster.Health;
        count = 1;
    } else
    {
        //weapon text parser
        for (var i = 0; i < strArray.length; i++)
        {
            for (var j = 0; j < weapon.length; j++)
            {
                if (strArray[i] == weapon[j].Name)
                {
                    userWeapon = strArray[i];
                    userWeaponDamage = weapon[j].Damage;
                }
            }
        }
        //attack text parser
        for (var i = 0; i < strArray.length; i++) {
            for (var j = 0; j < actionArray.length; j++) {
                if (strArray[i] == actionArray[j].Name) {
                    userAction = strArray[i];
                    userActionDamage = actionArray[j].DamageMulti;
                    userOverallDamage = userWeaponDamage * userActionDamage; // 
                    currentMonsterHealth = currentMonsterHealth - userOverallDamage;
                    writeToTextArea("" + newUser.Name + " " + userAction + " " + chosenMonster.Name + " with " + userWeapon + " Dealing " + userOverallDamage);
                    writeToTextArea(chosenMonster.Name + " has " + currentMonsterHealth + " Health remaining");

                }
            }
        }
        //items text parser
        for (var i = 0; i < strArray.length; i++) {
            for (var j = 0; j < items.length; j++) {
                if (strArray[i] == items[j].Name) {
                    if (items[j].Inventory == 0) {
                        writeToTextArea(newUser.Name + " don't have " + items[j].Name + "s in your inventory");
                    }
                    else
                    {
                        newUser.Health = newUser.Health + items[j].Value;
                        if (newUser.Health > newUser.MaxHealth)
                        {
                            newUser.Health = newUser.MaxHealth
                        }
                        items[j].Inventory--;
                        writeToTextArea("You have used " + items[j].Name + "\n" + newUser.Name + " have gained " + items[j].Value + " HP\nYour current health is " + newUser.Health);
                    }
                }
            }
        }




        if (newUser.Health >= 0 && currentMonsterHealth >= 0)
        {
            newUser.Health = newUser.Health - chosenMonster.MonDamage;
            writeToTextArea(chosenMonster.Name + " has Attacked you! Dealing: " + chosenMonster.MonDamage + " Damage" + " You have: " + newUser.Health + " Health remaining");
        }
        if (newUser.Health < 1)
        {
            writeToTextArea("You Have Been Defeated!");
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



        // might want to move this text parser somewhere else as i dont know where to put it

        for (var i = 0; i < strArray.length; i++) // this is the text parser for going around the map
        {
            if (strArray[i] == "go") {
                for (var i = 0; i < strArray.length; i++) {
                    for (var j = 0; j < directions.length; j++) {
                        if (strArray[i] == directions[j].name) {
                            newUser.CoOrdinates.Yaxis = newUser.CoOrdinates.Yaxis + directions[j].YAxis; //increase or decreases the y axis of the user's character depending on the direction they are going
                            newUser.CoOrdinates.Xaxis = newUser.CoOrdinates.Xaxis + directions[j].XAxis; //increase or decreases the x axis of the user's character depending on the direction they are going
                            if (newUser.CoOrdinates.Yaxis > Math.floor(Math.random() * 15) + 10 || newUser.CoOrdinates.YAxis < Math.floor(Math.random() * -15) - 10) //sets the boundaries of the for the y axis. The range is from 10 to 15 or 10 to 25???
                            {
                                writeToTextArea("You have left the (whatever place we are setting the game on)")
                            }
                            else if (newUser.CoOrdinates.XAxis > Math.floor(Math.random() * 15) + 10 || newUser.CoOrdinates.XAxis < Math.floor(Math.random() * -15) - 10) //sets the boundaries of the for the x axis. The range is from 10 to 15 or 10 to 25???
                            {
                                writeToTextArea("You have left the (whatever place we are setting the game on)")
                            }
                            else {
                                writeToTextArea("You went " + directions[j].name);
                                alert(newUser.CoOrdinates.Yaxis + "," + newUser.CoOrdinates.Xaxis)
                                //document.getElementById("input").value = "";

                            }
                        }
                    }
                }
            }
        }


        if (currentMonsterHealth <= 0) {
            monstersKilled.push(chosenMonster.Name);
            newUser.EXP = newUser.EXP + chosenMonster.EXP; //adds the monster's exp to the user's current EXP
            while (newUser.EXP >= newUser.MaxEXP) {
                newUser.Level = newUser.Level + 1; //increase level by one
                newUser.MaxHealth = newUser.MaxHealth + 10 * newUser.Level; //increases user's max health by 10 * the user's current level
                newUser.Health = newUser.MaxHealth; //current health fills back up after levelling up
                //newUser.DMG =  Math.round((newUser.DMG + 2 + Math.floor(Math.random() * 3) + 1) * 1.02);
                newUser.EXP = newUser.EXP - newUser.MaxEXP; // used so that the loop will keep looping until newUser.EXP is lesser than newUser.MaxEXP
                newUser.MaxEXP = newUser.MaxEXP + 10 * newUser.Level;
                writeToTextArea("You leveled up to LVL: " + newUser.Level + "\nHealth is now: " + newUser.MaxHealth + "\nNext amount of EXP needed to level up is: " + newUser.MaxEXP);

            }
            writeToTextArea("You gained " + chosenMonster.EXP + " EXP")
            spawnMonster(); // creates another monster to fight against
            count = 0;
        }

    }
}

function writeToTextArea(string) {
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}
// gen monster 
function spawnMonster() {
    var rand = Math.floor(Math.random() * monsters.length);
    chosenMonster = monsters[rand];
    writeToTextArea("You are fighting: " + chosenMonster.Name);

}

function userStatus()
{
    writeToTextArea("You have chosen to Check Status");
    writeToTextArea("Your Current level is: " + newUser.Level);

    for (var i = 0; i < monstersKilled.length; i++) {
        writeToTextArea("Monster killed: " + monstersKilled[i]);

    }


}
