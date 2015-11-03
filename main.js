var userWeapon = "";
var weapons =[
	{id: 1, Name: "sword", Damage: 15},
	{id: 2, Name: "halberd", Damage:25},
	{id: 3, Name: "rapier", Damage:10},
	{id: 4, Name: "claymore", Damage:20}
];
var actionArray = ["attack", "run", "talk"];
var keywordArray = ["inventory", "status", "enemy", "health"];
var userAction = "";
var userCheckKeyword = "";
function actor(Name, Health, Level){ 
	this.Name = Name;
	this.Health = Health;
	this.Level = Level;
}


var newUser = new actor("Ollie",200,1);
newUser.Name = "bob";
alert(newUser.Name);

function action()
{
    var userInput = document.getElementById("userInput").value.toLowerCase();
    var strArray = userInput.split(" ");

    for(var i = 0; i < strArray.length; i++)
    {
        for(var j = 0; j < weapons.length; j++)
        {
            if (strArray[i] == weapons[j].Name)
            {
                userWeapon = strArray[i];
				
            }
        }
    }

    for(var i = 0; i < strArray.length; i++)
    {
        for(var j = 0; j < actionArray.length; j++)
        {
            if (strArray[i] == actionArray[j])
            {
                userAction = strArray[i];
            }
        }
    }

  
    for(var i = 0; i < strArray.length; i++)
    {
        if (strArray[i] == "check")
        {
            for (var i = 0; i < strArray.length; i++)
            {
                for (var j = 0; j < keywordArray.length; j++) {

                    if (strArray[i] == keywordArray[j]) 
					{
                        userCheckKeyword = strArray[i];
                        
						switch(userCheckKeyword){
						
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
								usereHealth();
						break;
						
                    }
				}
			}
           
            }
        }
    }
	
	writeToTextArea("" + actor.Name + " " + userAction + " with " + userWeapon);
    
}

function writeToTextArea(string)
{
	document.getElementById("output").value = "" + string + "\n" + document.getElementById("output").value.replace("","");
	
}

//function userStatus()
//{
  //writeToTextArea("Your Current level is: " + newUser.Name);
	
//}
