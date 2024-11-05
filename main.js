var game,level,color=["red","blue","yellow","green","purple","lightgreen","lightblue","orange","brown","pink"],water=[],w=[],currentLevel,clicked=[],transferring=false,t=false,size=1,sizechange=0.05,won=false,moves=0;
var testTubePosition = {
    0: [[-110,130], [-20, 130], [70, 130], [-65,320], [15, 320]],
    1: [[-110,130], [-20, 130], [70, 130],[-110,320], [-20, 320], [70, 320]],
    2: [[-140,130],[-60,130],[20,130],[100,130],[-110,320], [-20, 320], [70, 320]],
    3: [[-140,130],[-60,130],[20,130],[100,130],[-140,320],[-60,320],[20,320],[100,320]],
    7: [[-140,100],[-60,100],[20,100],[100,100],[-140,275],[-60,275],[20,275],[100,275],[-140,450],[-60,450],[20,450],[100,450]],
};

window.onload = function() {
    game = document.getElementById("game");
    level = document.getElementById("level");
}

window.OpenLevel = function(x) {
    moves = 0;
    currentLevel = x;
    won = false;
    level.style.display = "block";
    level.innerHTML = "";
    water = [];
    let a = [], c = 0;
    for (let i = 0; i < x + 3; i++) {
        for (let j = 0; j < 4; j++) {
            a.push(color[i]);
        }
    }
    a = shuffle(a);
    for (let i = 0; i < x + 3; i++) {
        water[i] = [];
        for (let j = 0; j < 4; j++) {
            water[i].push(a[c]);
            c++;
        }
    }
    water.push(["transparent", "transparent", "transparent", "transparent"], ["transparent", "transparent", "transparent", "transparent"]);
    w = water.map((a) => [...a]);
    ApplyInfo();
}

function ApplyInfo(a = water) {
    if (!won) {
        let d = 0, heading = ["EASY", "MEDIUM", "HARD", "VERY HARD", "", "", "", "IMPOSSIBLE"][currentLevel];
        level.innerHTML = `<div id = 'lvl-heading'>${heading}</div>`;
        for (let i of testTubePosition[currentLevel]) {
            level.innerHTML += `<div class = "test-tube" style="top:${i[1]}px;left:calc(50vw + ${i[0]}px);transform:rotate(0deg);" onclick="Clicked(${d});">
                <div class="colors" style = "background-color:${a[d][0]};top:100px;"></div>
                <div class="colors" style = "background-color:${a[d][1]};top:70px;"></div>
                <div class="colors" style = "background-color:${a[d][2]};top:40px;"></div>
                <div class="colors" style = "background-color:${a[d][3]};top:10px;"></div>
            </div>`;
            d++;
        }
        level.innerHTML += `<div id = "restart" class = "game-buttons" onclick = "Restart();">RESTART</div><div id = "home" class = "game-buttons" onclick = "ShowMenu();">HOME</div><div id = "moves">Moves: ${moves}</div>`;
    }
}

window.Clicked = function(x) {
    if (!transferring) {
        if (clicked.length == 0) {
            clicked.push(x);
            document.getElementsByClassName("test-tube")[x].style.transition = "0.2s linear";
            document.getElementsByClassName("test-tube")[x].style.transform = "scale(1.08)";
        }
        else {
            clicked.push(x);
            let el = document.getElementsByClassName("test-tube")[clicked[0]];
            el.style.transform = "scale(1) rotate(0deg)";
            if (clicked[0] != clicked[1]) {
                el.style.transition = "1s linear";
                moves++;
                document.getElementById("moves").innerHTML = "Moves: " + moves;
                Transfer(...clicked);
            }
            clicked = [];
        }
    }
}

// Push operation to add color to the top of the tube
function push(tube, color) {
    for (let i = 0; i < 4; i++) {
        if (tube[i] === "transparent") {
            tube[i] = color;
            return;
        }
    }
}

// Pop operation to remove the top color from the tube
function pop(tube) {
    for (let i = 3; i >= 0; i--) {
        if (tube[i] !== "transparent") {
            const color = tube[i];
            tube[i] = "transparent";
            return color;
        }
    }
    return null; // Return null if the tube is empty
}

function Transfer(a, b) {
    if (!water[b].includes("transparent") || water[a].every((color) => color === "transparent")) {
        moves -= 1;
        document.getElementById("moves").innerHTML = "Moves: " + moves;
        return;
    }

    const colorToTransfer = pop(water[a]);

    if (colorToTransfer) {
        push(water[b], colorToTransfer);
    }

    setTimeout(() => {
        ApplyInfo();
        TransferAnim(a, b);
        Won();
    }, 1000);
}

function TransferAnim(a, b) {
    let el = document.getElementsByClassName("test-tube")[a];
    transferring = true;
    el.style.zIndex = "100";
    el.style.top = `calc(${testTubePosition[currentLevel][b][1]}px - 90px)`;
    el.style.left = `calc(50vw + ${testTubePosition[currentLevel][b][0]}px - 70px)`;
    el.style.transform = "rotate(75deg)";
    setTimeout(function() {
        el.style.transform = "rotate(90deg)";
    }, 1000)
    setTimeout(function() {
        el.style.left = `calc(50vw + ${testTubePosition[currentLevel][a][0]}px)`;
        el.style.top = `calc(${testTubePosition[currentLevel][a][1]}px)`;
        el.style.transform = "rotate(0deg)";
    }, 2000);
    setTimeout(function() {
        el.style.zIndex = "0";
        transferring = false;
    }, 3000);
}

window.Restart = function() {
    moves = 0;
    water = w.map((a) => [...a]);
    won = false;
    ApplyInfo(w);
}

window.ShowMenu = function() {
    document.getElementById("level").style.display = "none";
}

function Won() {
    for (let i of water) {
        if (i[0] != i[1] || i[1] != i[2] || i[2] != i[3]) {
            return;
        }
    }
    won = true;
    level.innerHTML = `<div id="won">YOU WON</div><div id = "restart" class = "game-buttons" onclick = "Restart();">RESTART</div><div id = "home" class = "game-buttons" onclick = "ShowMenu();">HOME</div>`;
}

function shuffle(x) {
    let a = [], len = x.length;
    for (let i = 0; i < len; i++) {
        let n = Math.floor(Math.random() * x.length);
        a.push(x[n]);
        x.splice(n, 1);
    }
    return a;
}
window.ShowRules = function() {
    document.getElementById("rules-page").style.display = "block";
    setTimeout(function() {
        document.getElementById("rules-page").style.opacity = "1";
    },50);
}

window.HideRules = function() {
    setTimeout(function() {
        document.getElementById("rules-page").style.display = "none";
    },500);
    document.getElementById("rules-page").style.opacity = "0";
}

