const pathImages = "./src/assets/icons/";

const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),

    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playersSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },  
};

const playersSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:"Exodian",
        type:"Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    }
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function createCardImage(IdCard, fieldSide){
    // injetar tag images dinamicamente
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playersSides.player1){
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    };
    
    return cardImage;
};

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();
    
    await ShowHiddenCardFiledsImages(true);

    await hiddenCardDetails();

    await drawCardsInFiled(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await drawButton(duelResults);
    await upDateScore();
    
}

async function drawCardsInFiled(cardId, computerCardId){    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function ShowHiddenCardFiledsImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value === false){
        
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    }
}

async function drawButton(text){    
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
}

async function upDateScore(){
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "win";
        state.score.playerScore++;
    }     
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";        
        state.score.computerScore++
    }

    await playAudio(duelResults);
    return duelResults;
}

async function removeAllCardsImages(){

    let {computerBOX, player1BOX} =  state.playersSides;

    let imgElements = computerBOX.querySelectorAll("img");

    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");

    imgElements.forEach((img) => img.remove());

}

async function drawSelectCard(index){
    
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
    
    
};

async function drawCards(cardNumbers, fieldSide){

    for(let i=0; i < cardNumbers; i++){

        const randomIdCard =  await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);

    };
};

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch{
        console.log("Arquivo de audio não existente.")
    }
}

async function init(){

   await ShowHiddenCardFiledsImages(false);

   drawCards(5,playersSides.player1);
   drawCards(5,playersSides.computer);

   const bgm = document.getElementById("bgm")
   bgm.play();
};

init();