const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const dice3 = document.getElementById("dice3");

const rollButton = document.getElementById("roll-dice");
const resultDisplay = document.getElementById("dice-result");
const resultsText = document.getElementById("dice-results");

const faces = [
    { face: "front", color: "Red", x: 0, y: 0 },
    { face: "back", color: "Green", x: 0, y: 180 },
    { face: "left", color: "Blue", x: 0, y: -90 },
    { face: "right", color: "Yellow", x: 0, y: 90 },
    { face: "top", color: "Pink", x: -90, y: 0 },
    { face: "bottom", color: "Orange", x: 90, y: 0 },
];

let lastRotation1 = { x: 0, y: 0 };
let lastRotation2 = { x: 0, y: 0 };
let lastRotation3 = { x: 0, y: 0 };

let players = [];

function getRandomRotation() {
    return faces[Math.floor(Math.random() * faces.length)];
}

function addFullRotation(rotation, lastRotation) {
    let fullRotationX = rotation.x + 360 * Math.floor(Math.random() * 3 + 1);
    let fullRotationY = rotation.y + 360 * Math.floor(Math.random() * 3 + 1);

    if (fullRotationX === lastRotation.x && fullRotationY === lastRotation.y) {
        fullRotationX += 1;
        fullRotationY += 1;
    }

    return { x: fullRotationX, y: fullRotationY, face: rotation.face };
}

function rollDice() {
    const targetRotation1 = getRandomRotation();
    const targetRotation2 = getRandomRotation();
    const targetRotation3 = getRandomRotation();

    const finalRotation1 = addFullRotation(targetRotation1, lastRotation1);
    const finalRotation2 = addFullRotation(targetRotation2, lastRotation2);
    const finalRotation3 = addFullRotation(targetRotation3, lastRotation3);

    dice1.style.transform = `rotateX(${finalRotation1.x}deg) rotateY(${finalRotation1.y}deg)`;
    dice2.style.transform = `rotateX(${finalRotation2.x}deg) rotateY(${finalRotation2.y}deg)`;
    dice3.style.transform = `rotateX(${finalRotation3.x}deg) rotateY(${finalRotation3.y}deg)`;

    lastRotation1 = finalRotation1;
    lastRotation2 = finalRotation2;
    lastRotation3 = finalRotation3;

    const resultColors = [
        faces.find(f => f.x === targetRotation1.x && f.y === targetRotation1.y).color,
        faces.find(f => f.x === targetRotation2.x && f.y === targetRotation2.y).color,
        faces.find(f => f.x === targetRotation3.x && f.y === targetRotation3.y).color,
    ];

    const coloredResults = resultColors.map(color => {
        return `<span style="color: ${color};">${color}</span>`;
    }).join(", ");

    setTimeout(() => {
        resultsText.innerHTML = coloredResults;
    }, 1000);

    players.forEach(player => {
        let matchedColors = 0;
        resultColors.forEach(color => {
            if (color === player.color) {
                matchedColors++;
            }
        });

        const winnings = (matchedColors * player.bet) + player.bet;

        const playerItem = document.getElementById(player.id);
        setTimeout(() => {
            playerItem.querySelector(".result").innerHTML = player.resultText;
            playerItem.querySelector(".winnings").innerHTML = matchedColors > 0 ? `+${winnings}` : "-";
        }, 1000);
    });
}

rollButton.addEventListener("click", function() {
    // Disable the button to make it not clickable
    rollButton.disabled = true;
  
    // Change cursor to loading
    document.body.style.cursor = 'progress';
  
    // Modify the button's appearance (e.g., change background color)
    rollButton.style.backgroundColor = 'black';
    rollButton.style.color = 'red';

  
    // Perform the action
    rollDice();
  
    // Reset the cursor and re-enable the button after 1 second
    setTimeout(function() {
      rollButton.disabled = false;  // Enable the button
      rollButton.style.backgroundColor = '#27ae60';  // Reset button's background color
      document.body.style.cursor = 'default';  // Reset cursor to default
      rollButton.style.color = 'white';

    }, 2000); // 1000 milliseconds = 1 second
  });
  
  
  
const addPlayerButton = document.getElementById("add-player");
const playerForm = document.getElementById("player-form");
const playerNameInput = document.getElementById("player-name");
const playerColorSelect = document.getElementById("player-color");
const playerBetInput = document.getElementById("player-bet");
const playersList = document.getElementById("players");
const clearButton = document.getElementById("clear");
const playerListContainer = document.getElementById('player-list-container');

addPlayerButton.addEventListener("click", () => {
    playerForm.style.display = "block";
});

playerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const playerName = playerNameInput.value.trim();
    const playerColor = playerColorSelect.value;
    const playerBet = parseInt(playerBetInput.value, 10);

    if (playerName && playerBet > 0) {
        const playerExists = players.some(player => player.name.toLowerCase() === playerName.toLowerCase());

        if (playerExists) {
            alert("This player name is already taken. Please choose another name.");
        } else {
            const playerId = `player-${Date.now()}`;
            const playerItem = document.createElement("li");
            playerItem.id = playerId;
            playerItem.innerHTML = `
                ${playerName} -- <span class="bet">${playerBet}</span> points on --<span style="color: ${playerColor};">${playerColor}</span>.
               <div class="edit-player-container">
                    <p class="edit-bet">Edit Bet</p>
                    <p class="remove-player">x</p>
                </div>
                <br><span class="result"></span><br><span class="winnings"></span>
            `;

            players.push({
                id: playerId,
                name: playerName,
                color: playerColor,
                bet: playerBet,
                resultText: "",
                playerItem: playerItem,
            });

            players.sort((a, b) => b.bet - a.bet);

            playersList.innerHTML = '';
            players.forEach(player => {
                playersList.appendChild(player.playerItem);
            });

            playerItem.querySelector(".remove-player").addEventListener("click", () => {
                players = players.filter(player => player.id !== playerId);
                playerItem.remove();
            });

            playerItem.querySelector(".edit-bet").addEventListener("click", () => {
                const newBet = prompt("Enter new bet:", playerBet);

                if (newBet && !isNaN(newBet) && newBet > 0) {
                    playerBetInput.value = newBet;
                    playerItem.querySelector(".bet").textContent = newBet;

                    const player = players.find(p => p.id === playerId);
                    player.bet = parseInt(newBet, 10);

                    players.sort((a, b) => b.bet - a.bet);
                    playersList.innerHTML = '';
                    players.forEach(player => {
                        playersList.appendChild(player.playerItem);
                    });
                } else {
                    alert("Invalid bet amount.");
                }
            });

            playerForm.style.display = "none";
            playerNameInput.value = "";
            playerBetInput.value = "";
        }
    } else {
        alert("Please fill in all fields correctly.");
    }
});

clearButton.addEventListener("click", () => {
    playersList.innerHTML = ' ';
    players = [];
});



const showPlayersButton = document.getElementById('burger-menu'); 
const gameContainer = document.getElementById('game-container'); 

let isPlayersHidden = false;

showPlayersButton.addEventListener('click', () => {
    event.stopPropagation();

    if (isPlayersHidden){
        playerListContainer.style.display = 'block';
        isPlayersHidden = false;
        showPlayersButton.innerText = 'Hide Players'
    }else{
        isPlayersHidden = true;
        showPlayersButton.innerText = 'Show Players'
        playerListContainer.style.display = 'none';

    }


})

gameContainer.addEventListener('click', () => {

    if (!isPlayersHidden){
        playerListContainer.style.display = 'none';
        isPlayersHidden = true;
        showPlayersButton.innerText = 'Show Players'
    }
})

