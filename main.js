var userWeapon = "";
var chosenMonster = "";
var count = 0;
var monstersKilled = [];
var directionFace = "forward";
var currentMonsterHealth;

var events = [
	{ Name: "Special-Weapon", Chance: 0.05 },
	{ Name: "Chest", Chance: 0.25 },
	{ Name: "Monster", Chance: 0.60 },

]

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

function coOrdinates(Xaxis, Yaxis) {
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

function prefix(Name, DamageMod, ConditionMod, ValueMod, SpecialEffect, Rarity)
{
    this.Name = Name;
    this.DamageMod = DamageMod;
	this.ConditionMod = ConditionMod;
	this.ValueMod = ValueMod;
	this.SpecialEffect = SpecialEffect;
	this.Rarity = Rarity;
}

var weaponPrefix = [
	new prefix("common", 1, 1, 1, "none", "none"),
	new prefix("rusty", 0.6, 0.4, 0.4, "tetanus", "common"),
	new prefix("trusty", 1, 1, 1, "unbreakable", "unique"),
	new prefix("antique", 0.6, 0.2, 5.25, "none", "rare"),
	new prefix("crystalised", 3, 0.8, 0.7, "bleed", "v-rare"),
	new prefix("tempered", 1.1, 0.85, 0.9, "none", "rare"),
	new prefix("cursed", 1.5, 1.5, 2.5, "cursed?", "unique"),
	new prefix("baneforged", 2, 2, 0.1, "argh", "unique")
];

function weapons(Name, Damage, Condition, Value, Prefix)
{
    this.Name = Name;
    this.Damage = Damage;
	this.Condition = Condition;
	this.Value = Value;
    this.Prefix = new prefix("devNULL", 1);
}

var weapon = [
	new weapons("sword", 15, weaponPrefix[2]),
	//new weapons("halberd", 25, weaponPrefix[0]),
	//new weapons("rapier", 10, weaponPrefix[0]),
	//new weapons("claymore", 20, weaponPrefix[0])
];

var items = [ // order the items to the highest lootChance and the value has to be from 0 to 1
    { Name: "adrenaline", Inventory: 1, Value: 150, LootChance: 0.3 },
    { Name: "painkiller", Inventory: 3, Value: 50, LootChance: 0.4 },
    { Name: "nothing", Inventory: 0, Value: 50, LootChance: 1 },
];

function eventsGen()
{
    var count = 0;
    var randNumb = Math.random();

    for (var i = 0; i < events.length; i++)
    {
        if (count == 0) {
            alert(randNumb);
            if (events[i].Name == "Monster" && events[i].Chance >= randNumb)
            {
                writeToTextArea("You have encountered an enemy!");
                spawnMonster();
                count++;
            }
            else if (events[i].Name == "Chest" && events[i].Chance >= randNumb && randNumb < 0.5 )
            {
                
                spawnChest();
                count++;
            }
            else if (events[i].Name == "Special-Weapon" && events[i].Chance >= randNumb )
            {   
                roamingLoot();
                count++;
            }
        }
    }
}


function start()
{
    writeToTextArea("Welcome to Our Text Based Adventure Game!");
    spawnMonster();
}

function drops() {
    var randNumb = Math.random();
    var count = 0;
    for (i = 0; i < items.length; i++) {
        if (count == 0) 
		{
            if (randNumb < items[i].LootChance) {
                items[i].Inventory++;
                if (items[i].Name == "nothing") {
                    items[i].Inventory--;
                }
                writeToTextArea("You received " + items[i].Name);
                count++;
            }
        }
    }
}

function action() {

    var chanceTOCallFunction = Math.floor(Math.random() * 5) + 1;
    var playerTurn = 1; 
    var enemyTurn = 0;

    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");
	
	
    for (var i = 0; i < strArray.length; i++)
    {
        if (strArray[i] == "check")
        {
            for (var i = 0; i < strArray.length; i++)
            {
                for (var j = 0; j < keywordArray.length; j++)
                {

                    if (strArray[i] == keywordArray[j])
                    {
                        userCheckKeyword = strArray[i];

                        switch (userCheckKeyword)
                        {

                            case "status":
                                userStatus();
								playerTurn = 0;
                                break;

                            case "inventory":
                                userInventory();
								playerTurn = 0;
                                break;

                            case "enemy":
                                enemyInfo();
								playerTurn = 0;
                                break;

                            case "health":
                                userHealth();
								playerTurn = 0;
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
			writeToTextArea("You have moved down to the forgotten cave! Have umm fun...?");
            newUser.CoOrdinates.Xaxis = 0; // reset coOrdinates to 0,0 as its a new area 
            newUser.CoOrdinates.Yaxis = 0;
            directionFace = "forward";
			alert(directionFace);
        }
        else if (strArray[i] == "up" && newUser.CoOrdinates.Xaxis == 5 && newUser.CoOrdinates.Yaxis == 5) // if the user navigates to this spot and inputs up, they will return to original coOrdinates.
        {																								//allowing them to carry on with the game etc.
            newUser.CoOrdinates.Xaxis = 6;
            newUser.CoOrdinates.Yaxis = 2;
        }
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
								playerTurn = 0;
                                alert(newUser.CoOrdinates.Xaxis + "," + newUser.CoOrdinates.Yaxis)
                                eventsGen();
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

						   if (newUser.CoOrdinates.Xaxis >= 3 && newUser.CoOrdinates.Yaxis >= 2 && newUser.CoOrdinates.Xaxis <= 5 && newUser.CoOrdinates.Yaxis <= 5) // just used as an example. i have suggested that within these coOrdinates the user can see the cave
							{
								writeToTextArea("If you move to area 6,2 you will find a Forgotten Cave! or you can turn around and explore a different area!"); // i think we should tell the user where they are etc. allowing them to navigate to areas
							}

							if (newUser.CoOrdinates.Xaxis == 6 && newUser.CoOrdinates.Yaxis == 2) //this works and we can use this as a base to find locations.
							{
								writeToTextArea("You have discovered The Forgotten Cave! move DOWN to explore!");
							}

                        }
                    }

                }
            }
        }
    }


    if (currentMonsterHealth <= 0)
    {
        count = 1;
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
        //drops();

        //spawnMonster(); // creates another monster to fight against

        count = 0;

    }
	
    if (playerTurn == 1)
    {
        
        if (count == 0)
        {
            currentMonsterHealth = chosenMonster.Health;
            count = 1;
        }
        else
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
                        playerTurn = 0;
                        enemyTurn = 1;
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
                        playerTurn = 0;
                        enemyTurn = 1;
                    }
                }
            }
            //items text parser
            for (var i = 0; i < strArray.length; i++)
            {
                for (var j = 0; j < items.length; j++)
                {
                    if (strArray[i] == items[j].Name)
                    {
                        if (items[j].Inventory == 0)
                        {
                            writeToTextArea(newUser.Name + " don't have " + items[j].Name + "s in your inventory");
                        }
                        else
                        {
                            newUser.Health = newUser.Health + items[j].Value;
                            if (newUser.Health > newUser.MaxHealth)
                            {
                                newUser.Health = newUser.MaxHealth
                            }
                            playerTurn = 0;
                            enemyTurn = 1;
                            items[j].Inventory--;
                            writeToTextArea("Your current health is " + newUser.Health + " " + newUser.Name + " have gained " + items[j].Value + "HP" + "\n" + "You have used " + items[j].Name);
                        }
                    }
                }
            }
        }
    }

    if (enemyTurn == 1)
    {
        playerTurn = 1;
        enemyTurn = 0;
        if (newUser.Health >= 0 && currentMonsterHealth >= 0)
        {
            newUser.Health = newUser.Health - chosenMonster.MonDamage;
            writeToTextArea(chosenMonster.Name + " has Attacked you! Dealing: " + chosenMonster.MonDamage + " Damage" + " You have: " + newUser.Health + " Health remaining");
        }
        if (newUser.Health <= 0)
        {
            writeToTextArea("\n\n You Have Been Defeated!\n\n");
            defeat();
        }
    }


}



function writeToTextArea(string)
{
    document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("", "");

}
// gen monster 
function spawnMonster() 
{
    var rand = Math.floor(Math.random() * monsters.length);
    chosenMonster = monsters[rand];
    currentMonsterHealth = chosenMonster.Health;
    writeToTextArea("You are fighting: " + chosenMonster.Name);

}

function spawnChest() 
{
    writeToTextArea("You found a chest");
    drops();
}

function userStatus() {
    writeToTextArea("You have chosen to Check Status");
    writeToTextArea("Your Current level is: " + newUser.Level);

    for (var i = 0; i < monstersKilled.length; i++) {
        writeToTextArea("Monster killed: " + monstersKilled[i]);

    }


}
        }

function userInventory() {


    for (var i = 0; i < items.length; i++) {
        if (items[i].Inventory > 0) {
            writeToTextArea("Item Name: " + items[i].Name + " Quantity: " + items[i].Inventory);
    }
    writeToTextArea("Your Inventory: ");
}

function enemyInfo()
{
    writeToTextArea("You are currently fighting: " + chosenMonster.Name);
    writeToTextArea(chosenMonster.Name + " Spawned with " + chosenMonster.Health + "HP" + " and now has: " + currentMonsterHealth + "HP remaining " + " Keep fighting!");
    writeToTextArea("Enemy Information: ");
}

function roamingLoot()
{
    var weaponChance = Math.floor(Math.random() * 100) + 1;
	
	for(var i = 0; i < weapon.length; i++)
	{
		if(weapon[i].Name == "dragonblade" || weapon[i].Name == "ghostblade")
		{
			writeToTextArea("Found no New Item");
			return 0;
		}
		
	}
    if (newUser.Level <= 3 && weaponChance <= 70)
    {		
			weapon.push(new weapons("dragonblade", 45, weaponPrefix[4]));	
    }
    else if (newUser.Level > 3 && newUser.Level <= 5 && weaponChance > 70)
    {
        weapon.push(new weapons("ghostblade", 70, weaponPrefix[6]));
    }

    writeToTextArea("You have found some speacial Loot!");

    for (var i = 0; i < weapon.length; i++)
    {
        var count = i;
        if (count == weapon.length - 1)
        {
            writeToTextArea("New Weapon Found: " + weapon[count].Name);
        }
    }
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

