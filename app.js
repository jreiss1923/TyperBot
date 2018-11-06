const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

var words = ['try', 'why', 'fun', 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'dad', 'mom', 'that', 'with', 'they', 'this', 'have', 'from', 'word', 'what', 'were', 'when', 'your', 'said', 'there', 'each', 'which', 'their', 'will', 'other', 'about', 'many', 'then', 'them', 'these', 'some', 'would', 'make', 'like', ];
var wordTest = "";
var wordTestStored = "";
var startTime;
var endTime;
var calibrationTime;

function wordList(numWords){
   var i;
   for(i = 0; i < numWords; i++){
       wordTest += words[Math.floor(Math.random() * words.length)] + " ";
   }
}

function calculateErrors(arr1, arr2){
   var totalCount = 0;
   var arr1Bigger;
   var lowLength;
   var i;
   var j;

   if(arr1.length-1 > arr2.length){
       lowLength = arr2.length;
       arr1Bigger = 1;
   }
   else if(arr1.length-1 < arr2.length){
       lowLength = arr1.length;
       arr1Bigger = 0;
   }
   else if(arr1.length-1 === arr2.length){
       lowLength = arr2.length;
       arr1Bigger = -1;
   }

   for(i = 0; i < lowLength-1; i++){
       totalCount += Math.abs(arr1[i].length - arr2[i].length);
   }

   if(arr1Bigger == 1){
       totalCount += restOfLength(arr1, lowLength);
       return totalCount;
   }
   else if(arr1Bigger == 0){
       totalCount += restOfLength(arr2, lowLength);
       return totalCount;
   }
   else{
       return totalCount;
   }
}

function restOfLength(arr, lowLength){
   var i;
   var j;
   var restOfCount = 0;

   for(i = lowLength-1; i < arr.length; i++){
       if(arr[i].length > 0){
           restOfCount++;
       }
       for(j = 0; j < arr[i].length; j++){
           restOfCount++;
       }
   }

   return restOfCount;
}

function checkCorrect(arr1, arr2){
   var wrongCount = 0;

   var i;
   var j;

   for(i = 0; i < arr1.length; i++){
       if(arr2.length < i){
           break;
       }
       for(j = 0; j < arr1[i].length; j++){
           if(arr2[i][j] == null || arr2[i].length < j){
               i = arr1.length;
               break;
           }
           if(arr2[i][j] != arr1[i][j]){
               wrongCount++;
           }
       }
   }
   wrongCount += calculateErrors(arr1, arr2);
   return wrongCount;
}

function convertToNestedArray(arr){
   var i;
   var temp;
   var wordsArr;
  
   temp = arr.toString();
   temp = temp.replace(/,/g, " ");

   wordsArr = temp.split(" ");

  
   for(i = 0; i < wordsArr.length; i++){
       wordsArr[i] = wordsArr[i].split("");
   }

   return wordsArr;
}
// 'client.on('message')' commands are triggered when the
// specified message is read in a text channel that the bot is in.

client.on('message', message => {
   const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
   const command = args.shift().toLowerCase();

   if(message.author.bot) return;

   if(message.content.indexOf(config.prefix) !== 0) return;

   if(command === 'create'){
       wordList(parseInt(args[0]));
   }
  
   if(command === 'test'){
       startTime = message.createdAt;
       message.channel.send(wordTest);
       wordTestStored = wordTest;
       wordTest = "";
   }

   if(command === 'calibrate'){
       startTime = message.createdAt;
       message.channel.send("Type +testfinish as fast as you can!");
   }

   //if(command === 'help'){
     //  message.channel.send()
   //}

   if(command === 'testfinish'){
       if(wordTestStored == ""){
           endTime = message.createdAt;
           calibrationTime = (endTime - startTime)/60000;
           message.reply("Your calibration time was " + calibrationTime*60 + " seconds");
       }
       else{
           endTime = message.createdAt;
           var elapsedTime = (endTime-startTime)/60000 - calibrationTime;
           var totalEntries = 0;
           var i;
           var j;

           var tempArr = convertToNestedArray(args);
           var wordTestArr = convertToNestedArray(wordTestStored);

           var errors = checkCorrect(wordTestArr, tempArr);

           for(i = 0; i < tempArr.length; i++){
               for(j = 0; j < tempArr[i].length; j++){
                   totalEntries++;
               }
           }
           message.reply("Your time was " + elapsedTime*60 +" seconds");
           message.channel.send("You made " + errors + " errors");
           message.channel.send("Your WPM was " + totalEntries/5/elapsedTime + errors/elapsedTime);
       }
   }

  
});

client.login(config.token);
