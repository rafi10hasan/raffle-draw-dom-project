// select element
const textInputField = document.querySelector("#text-field");
const entryBtn = document.querySelector("#entry-btn");
const inputNumber = document.querySelector("#input-number");
const DisplayWinner = document.querySelector("#display-winner");
const pickWinnerBtn = document.querySelector("#pick-winner-btn");
const winnerList = document.querySelector("#winner-list");
const displayEntryList = document.querySelector("#table-body");
const audio = new Audio("/audio/small-applause.mp3");
const randomSound = new Audio("/audio/shuffle-cards-46455.mp3")

const allPerson = []; //collection of all person
let count = 0;        // count the table serial number
let countIndex = 0;   //count the winnerlist serial number

// initially all button are disabled
function disableButton() {
  entryBtn.setAttribute("disabled", true);
  pickWinnerBtn.setAttribute("disabled", true);
  inputNumber.setAttribute("readonly", true);
}

//input values from user
textInputField.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    entryBtn.removeAttribute("disabled");
  } else {
    disableButton();
  }
});

// click event of entry button 
entryBtn.addEventListener("click", () => {
  let personArray;
  if (textInputField.value.includes(",") && textInputField.value.match(/\n/g)) {
    disableButton();
    alert("read attentivly the placholder message");
  } else {
    personArray = textInputField.value.includes(",")
      ? textInputField.value.split(",")
      : textInputField.value.split("\n");
  }
  
  //if person array is not defined 
  if (personArray) {
    for (let i = 0; i < personArray.length; i++) {
      if (personArray[i] !== "") {
        const tr = document.createElement("tr");
        allPerson.push(personArray[i]);
        tr.innerHTML = `
              <td>${++count}
              <td>${personArray[i]}
              `;
        displayEntryList.appendChild(tr);
      }
    }
    //calculate the participants length
    let totalParticipants = document.getElementsByClassName('total-participants')[0].firstChild.nextElementSibling;
    let value = parseInt(totalParticipants.innerText) + personArray.length
    totalParticipants.innerText = value
    
    inputNumber.removeAttribute("readonly");
    document.getElementById("table-container").style.overflowY = "scroll";
    document.getElementById("table-container").style.overflowX = "hidden";
    textInputField.value = "";
  }
});

// shuffle the person given the values
function shufflePersonRandomly(arr) {
  let shuffleArray = [...arr];
  for (let i = 0; i < shuffleArray.length; i++) {
    const randNum = Math.floor(Math.random() * (i + 1));
    let temp = shuffleArray[i];
    shuffleArray[i] = shuffleArray[randNum];
    shuffleArray[randNum] = temp;
  }
  return shuffleArray;
}

//pick up your winners
pickWinnerBtn.addEventListener("click", () => {
  let shuffleArray = shufflePersonRandomly(allPerson);
  let len = shuffleArray.length;
  let time = 1.5; 
   //set time based on length
    if(len < 500 && len >250){
       time  = 8;
    }
    if(len > 499 && len <1501 ){
      time = 5
    }
    if(len < 251 && len > 120){
      time = 20
    }
    if(len > 10000){
      time = 0.1
    }
    if(len < 121){
      time = 60
    }

// dsiplay the winner randomly so here i call IIFE 
  for (let i = 1; i < len; i++) {
    //IIFE
    (function (i, index) {
      setTimeout(() => {
        const random = Math.floor(Math.random() * len); //generate a random index number
        DisplayWinner.value = shuffleArray[random];  // display the person in a particular time 
        randomSound.play()

        //display the actual winner
        if (index === len - 1) {
          if (inputNumber.value > countIndex) {
            audio.play();
            winnerList.children[countIndex].innerText = `${++countIndex}. ${DisplayWinner.value}`;
            let indexNum = allPerson.indexOf(shuffleArray[random]); // delete this winner from participants array
            allPerson.splice(indexNum,1);
            
          }
           else{
            //when raffle draw is completed
            pickWinnerBtn.setAttribute("disabled", true);
            alert("raffle draw is already completed");
            DisplayWinner.value = "";
          }
        }
      }, i);
    })(i * time, i);
   
  }
});

//enter button of number of winners
inputNumber.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    inputNumber.click();
  }
  
});

// take the user value and call addlist function
inputNumber.addEventListener("click", function (e) {
  if (e.target.value > 0) {
    pickWinnerBtn.removeAttribute("disabled");
    addList(e.target.value);
  } else {
    pickWinnerBtn.setAttribute("disabled", true);
  }
});

// addlist function
function addList(length) {
  const winnerList = document.getElementById("winner-list");
  /* ------ starting length,that means user add list from this value. */
  /* ------  length,that means user demanding value */
  let start = winnerList.children.length;
  //add list
  if (length > start) {
    for (let i = start; i < length; i++) {
      const div = document.createElement("div");
      div.classList.add("child");
      winnerList.appendChild(div);
    }
    if (pickWinnerBtn.hasAttribute("disabled")) {
      pickWinnerBtn.removeAttribute("disabled");
    }
   

  } 
  //delete list
  else {
    for (let i = start; i > length; i--) {
      if (winnerList.lastElementChild.innerText) {
        --countIndex;
      }
      //remove the child
      winnerList.removeChild(winnerList.lastElementChild);

      if (winnerList.children.length === countIndex) {
        pickWinnerBtn.setAttribute("disabled", true);
        DisplayWinner.value = "";
      }
    }
 
  }
}

