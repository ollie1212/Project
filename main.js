// JavaScript source code
var userWeapon = "";
var chosenMonster = "";
var count = 0;
var monstersKilled = [];
var directionFace = "forward";

var actionArray = [
{ Name: "attack", DamageMulti: 1.2 },
{ Name: "Slash", DamageMulti: 1.1 },
{ Name: "talk", DamageMulti: 0.8 }
];

//stores all the directions the user can take 
var directions = [
    { name: "forward", XAxis: 0, YAxis: 1 },
    { name: "right", XAxis: 1, YAxis: 0 },
    { name: "backward", XAxis: 0, YAxis: -1 },
    { name: "left", XAxis: -1, YAxis: 0 },
]

var keywordArray = ["inventory", "status", "enemy", "health"];
var userAction = "";
var userCheckKeyword = "";

function coOrdinates(Xaxis, Yaxis)
{
    this.Xaxis = Xaxis;
    this.Yaxis = Yaxis;
}


function actor(Name, Health, MaxHealth, Level, EXP, MaxEXP, CoOrdinates, MonDamage)
{
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

var items = [ // order the items to the highest lootChance and the value has to be from 0 to 1
    { Name: "adrenaline", Inventory: 1, Value: 150, LootChance: 0.9 },
    { Name: "painkiller", Inventory: 3, Value: 50, LootChance: 0.8 },
    { Name: "nothing", Inventory: 0, Value: 50, LootChance: 0 },
]

function start()
{
    writeToTextArea("Welcome to Our Text Based Adventure Game!");
    spawnMonster();
}

function drops()
{
    var randNumb = Math.random();
    var count = 0;
    for (i = 0; i < items.length; i++)
    {
        if (count == 0)
        {
            if (items[i].LootChance < randNumb)
            {
                items[i].Inventory++;
                if (items[i].Name == "nothing")
                {
                    items[i].Inventory--;
                }
                writeToTextArea("You received " + items[i].Name);
                count++;
            }
        }
    }
}

function action() {
    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");
    if (count == 0) {
        currentMonsterHealth = chosenMonster.Health;
        count = 1;
    } else {
        //weapon text parser
        for (var i = 0; i < strArray.length; i++) {
            for (var j = 0; j < weapon.length; j++) {
                if (strArray[i] == weapon[j].Name) {
                    userWeapon = strArray[i];
                    userWeaponDamage = weapon[j].Damage;
                }
            }
        }
        //attack text parser
        for (var i = 0; i < strArray.length; i++)
        {
            for (var j = 0; j < actionArray.length; j++)
            {
                if (strArray[i] == actionArray[j].Name)
                {
                    userAction = strArray[i];
                    userActionDamage = actionArray[j].DamageMulti;
                    userOverallDamage = userWeaponDamage * userActionDamage;
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
                    else {
                        newUser.Health = newUser.Health + items[j].Value;
                        if (newUser.Health > newUser.MaxHealth)
                        {
                            newUser.Health = newUser.MaxHealth
                        }
                        items[j].Inventory--;
                        writeToTextArea("Your current health is " + newUser.Health + " " + newUser.Name + " have gained " + items[j].Value + "HP" + "\n" + "You have used " + items[j].Name);
                    }
                }
            }
        }




        if (newUser.Health >= 0 && currentMonsterHealth >= 0) {
            newUser.Health = newUser.Health - chosenMonster.MonDamage;
            writeToTextArea(chosenMonster.Name + " has Attacked you! Dealing: " + chosenMonster.MonDamage + " Damage" + " You have: " + newUser.Health + " Health remaining");
        }
        if (newUser.Health <= 0) {
            writeToTextArea("\n" + "\n" + "You Have Been Defeated!" + "\n" + "\n");
            defeat();

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
                                    enemyInfo();
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

        for (var i = 0; i < strArray.length; i++) // loop to find the key word Down! or up! 
        {
            if (strArray[i] == "down") {
                newUser.CoOrdinates.Xaxis = 0; // reset coOrdinates to 0,0 as its a new area 
                newUser.CoOrdinates.Yaxis = 0;
                directionFace = "forward";
            }
            else if (strArray[i] == "up" && newUser.CoOrdinates.Xaxis == 5 && newUser.CoOrdinates.Yaxis == 5) // if the user navigates to this spot and inputs up, they will return to original coOrdinates.
            {																								//allowing them to carry on with the game etc.
                newUser.CoOrdinates.Xaxis = 6;
                newUser.CoOrdinates.Yaxis = 2;
            }
        }
        if (newUser.CoOrdinates.Xaxis >= 3 && newUser.CoOrdinates.Yaxis >= 2 && newUser.CoOrdinates.Xaxis <= 5 && newUser.CoOrdinates.Yaxis <= 5) // just used as an example. i have suggested that within these coOrdinates the user can see the cave
        {
            writeToTextArea("If you move to area 6,2 you will find a Forgotten Cave! or you can turn around and explore a different area!"); // i think we should tell the user where they are etc. allowing them to navigate to areas
        }

        if (newUser.CoOrdinates.Xaxis == 6 && newUser.CoOrdinates.Yaxis == 2) //this works and we can use this as a base to find locations.
        {
            writeToTextArea("You have discovered The Forgotton Cave! move DOWN to explore!");
        }

        // might want to move this text parser somewhere else as i dont know where to put it
        var countTemp = 0;
        for (var i = 0; i < strArray.length; i++) // this is the text parser for going around the map
        {
            if (strArray[i] == "go") {
                for (var i = 0; i < strArray.length; i++) {
                    for (var j = 0; j < directions.length; j++) {
                        if (countTemp == 0) {
                            if (strArray[i] == directions[j].name) {

                                newUser.CoOrdinates.Yaxis = newUser.CoOrdinates.Yaxis + directions[j].YAxis; //increase or decreases the y axis of the user's character depending on the direction they are going
                                newUser.CoOrdinates.Xaxis = newUser.CoOrdinates.Xaxis + directions[j].XAxis; //increase or decreases the x axis of the user's character depending on the direction they are going
                                countTemp = 1;
                                //alert (newUser.CoOrdinates.Xaxis + " " + newUser.CoOrdinates.Yaxis)
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
                                    alert(newUser.CoOrdinates.Xaxis + "," + newUser.CoOrdinates.Yaxis)
                                    //document.getElementById("input").value = "";

                                }
                                //forward
                                if (directions[j].name == "forward" && directionFace == "forward") {
                                    directionFace = "forward"
                                    directions[0].name = "forward"
                                    directions[1].name = "right"
                                    directions[2].name = "backward"
                                    directions[3].name = "left"
                                }
                                if (directions[j].name == "left" && directionFace == "forward") {
                                    directionFace = "left"
                                    directions[0].name = "right"
                                    directions[1].name = "backward"
                                    directions[2].name = "left"
                                    directions[3].name = "forward"
                                }
                                if (directions[j].name == "right" && directionFace == "forward") {
                                    directionFace = "right"
                                    directions[0].name = "left"
                                    directions[1].name = "forward"
                                    directions[2].name = "right"
                                    directions[3].name = "backward"
                                }
                                if (directions[j].name == "backward" && directionFace == "forward") {
                                    directionFace = "backward"
                                    directions[0].name = "backward"
                                    directions[1].name = "left"
                                    directions[2].name = "forward"
                                    directions[3].name = "right"
                                }

                                //right
                                if (directions[j].name == "forward" && directionFace == "right") {
                                    directionFace = "right"
                                    directions[0].name = "left"
                                    directions[1].name = "forward"
                                    directions[2].name = "right"
                                    directions[3].name = "backward"
                                }
                                if (directions[j].name == "left" && directionFace == "right") {
                                    directionFace = "forward"
                                    directions[0].name = "forward"
                                    directions[1].name = "right"
                                    directions[2].name = "backward"
                                    directions[3].name = "left"
                                }
                                if (directions[j].name == "right" && directionFace == "right") {
                                    directionFace = "backward"
                                    directions[0].name = "backward"
                                    directions[1].name = "left"
                                    directions[2].name = "forward"
                                    directions[3].name = "right"
                                }
                                if (directions[j].name == "backward" && directionFace == "right") {
                                    directionFace = "left"
                                    directions[0].name = "right"
                                    directions[1].name = "backward"
                                    directions[2].name = "left"
                                    directions[3].name = "forward"
                                }

                                //left
                                if (directions[j].name == "forward" && directionFace == "left") {
                                    directionFace = "left"
                                    directions[0].name = "left"
                                    directions[1].name = "forward"
                                    directions[2].name = "right"
                                    directions[3].name = "backward"
                                }
                                if (directions[j].name == "left" && directionFace == "left") {
                                    directionFace = "backward"
                                    directions[0].name = "backward"
                                    directions[1].name = "left"
                                    directions[2].name = "forward"
                                    directions[3].name = "right"
                                }
                                if (directions[j].name == "right" && directionFace == "left") {
                                    directionFace = "forward"
                                    directions[0].name = "forward"
                                    directions[1].name = "right"
                                    directions[2].name = "backward"
                                    directions[3].name = "left"
                                }
                                if (directions[j].name == "backward" && directionFace == "left") {
                                    directionFace = "right"
                                    directions[0].name = "left"
                                    directions[1].name = "forward"
                                    directions[2].name = "right"
                                    directions[3].name = "backward"
                                }

                                // back

                                if (directions[j].name == "forward" && directionFace == "backward") {
                                    directionFace = "backward"
                                    directions[0].name = "backward"
                                    directions[1].name = "left"
                                    directions[2].name = "forward"
                                    directions[3].name = "right"
                                }
                                if (directions[j].name == "left" && directionFace == "backward") {
                                    directionFace = "right"
                                    directions[0].name = "backward"
                                    directions[1].name = "right"
                                    directions[2].name = "left"
                                    directions[3].name = "backward"
                                }
                                if (directions[j].name == "right" && directionFace == "backward") {
                                    directionFace = "left"
                                    directions[0].name = "right"
                                    directions[1].name = "backward"
                                    directions[2].name = "left"
                                    directions[3].name = "forward"
                                }
                                if (directions[j].name == "backward" && directionFace == "backward") {
                                    directionFace = "forward"
                                    directions[0].name = "forward"
                                    directions[1].name = "right"
                                    directions[2].name = "backward"
                                    directions[3].name = "left"
                                }
                                alert(directionFace);



                            }
                        }

                    }
                }
            }
        }


        if (currentMonsterHealth <= 0)
        {
            monstersKilled.push(chosenMonster.Name);
            newUser.EXP = newUser.EXP + chosenMonster.EXP; //adds the monster's exp to the user's current EXP
            //drops();
            while (newUser.EXP >= newUser.MaxEXP)
            {
                newUser.Level = newUser.Level + 1; //increase level by one
                newUser.MaxHealth = newUser.MaxHealth + 10 * newUser.Level; //increases user's max health by 10 * the user's current level
                newUser.Health = newUser.MaxHealth; //current health fills back up after levelling up
                //newUser.DMG =  Math.round((newUser.DMG + 2 + Math.floor(Math.random() * 3) + 1) * 1.02);
                newUser.EXP = newUser.EXP - newUser.MaxEXP; // used so that the loop will keep looping until newUser.EXP is lesser than newUser.MaxEXP
                newUser.MaxEXP = newUser.MaxEXP + 10 * newUser.Level;
                writeToTextArea("You leveled up to LVL: " + newUser.Level + "\nHealth is now: " + newUser.MaxHealth + "\nNext amount of EXP needed to level up is: " + newUser.MaxEXP);

            }
            writeToTextArea("You gained " + chosenMonster.EXP + " EXP")
            drops();
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

function spawnChest()
{
    drops();
}

function userStatus() {
    writeToTextArea("You have chosen to Check Status");
    writeToTextArea("Your Current level is: " + newUser.Level);

    for (var i = 0; i < monstersKilled.length; i++) {
        writeToTextArea("Monster killed: " + monstersKilled[i]);

    }


}

function userInventory() {


    for (var i = 0; i < items.length; i++)
    {
        if (items[i].Inventory > 0)
        {
            writeToTextArea("Item Name: " + items[i].Name + " Quantity: " + items[i].Inventory);
        }
    }
    writeToTextArea("Your Inventory: ");
}

function enemyInfo()
{
    writeToTextArea("You are currently fighitng: " + chosenMonster.Name);
    writeToTextArea(chosenMonster.Name + " Spawned with " + chosenMonster.Health + "HP" + " and now has: " + currentMonsterHealth + "HP remaining " + " Keep fighting!");
    writeToTextArea("Enemy Information: ");


}

function defeat()
{
    newUser.Health = 200;
    newUser.MaxHealth = 200;
    newUser.Level = 1;
    newUser.EXP = 0
    newUser.MaxEXP = 20;
    start();
}
