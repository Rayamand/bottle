import { Bottle, Timer } from "./elements.js";
import { Auth, CheckForWin } from "./middlewares.js";

// the login page Middelware
if (Auth.check()) {
    document.getElementById("main").style.display = 'flex';
    document.querySelector(".name").innerHTML = localStorage.getItem("name");
    Timer();
}
else {
    document.getElementById("login").style.display = 'block';
    document.getElementById("loginBtn").onclick = () => {
        if (Auth.login(document.getElementById("name").value))
            window.location.reload(); // login succesfully
    }
}
// put the scores section data
const scoresContainer = document.getElementById("scores"),
    scores = JSON.parse(localStorage.getItem("scores") || "[]");
scores.forEach(score => {
    scoresContainer.insertAdjacentHTML('beforeend', `<tr>
        <td>${score.date}</td>
        <td>${score.name}</td>
        <td>${score.time}</td>
    </tr>`);
})

let bottles = [];
for (let i = 0; i < 6; i++)
    bottles.push(new Bottle(i)); // make a bottle
// remove two bottles randomly
let removedBottles = [];
do {
    let randomNumber = Math.floor(Math.random() * 5);
    if (!removedBottles.includes(randomNumber)) removedBottles.push(randomNumber);
} while (removedBottles.length < 2);
// finish :) now we have just four bottle
// let's put the colors on the bottles. yeh (when you listin to rap when you are coding)
let colorsLen = { c1: 0, c2: 0, c3: 0, c4: 0 },
    colors = ['c1', 'c2', 'c3', 'c4'];
bottles.forEach((bottle, index) => {
    if (!removedBottles.includes(bottle.id))
        while (bottle.colors.length < 4) {
            let color = colors[Math.floor(Math.random() * colors.length)];
            // we should now check the length of the color on game board not be more then 4
            if (colorsLen[color] < 4) {
                if (bottle.addColor(color))
                    colorsLen[color]++;
            }
        }
    // made the html of bottle
    bottle.madeHTML();
});
/**
 * set the all events for each bottle
 * @param {*} index the index of goal bottle we want set the events
 */
const eventForBottle = (index) => {
    const bottle = bottles[index];
    let content = bottle.HTML.children[1];
    // the click event for content colors of bottle
    content.onclick = () => {
        // just allow one bottle was in drop position
        if (!document.querySelector(".dropped")) {
            // set the mouse follow effect
            content.classList.add("dropped");
            window.onmousemove = (e) => {
                if (content.className.includes("dropped")) {
                    content.style.left = `${e.clientX + 10}px`;
                    content.style.top = `${e.clientY + 10}px`;
                    if (!e.target.className.includes("dropArea")) {
                        content.classList.remove("ready")
                        if (document.querySelector(".dropArea.ready"))
                            document.querySelector(".dropArea.ready").classList.remove(".ready");
                    }
                }
            }

            let dropAreas = document.querySelectorAll(".buttle .dropArea");
            for (let i = 0; i < dropAreas.length; i++) {
                const dropArea = dropAreas[i];
                dropArea.onmouseover = () => {
                    if (content.className.includes("dropped")) {
                        const id = parseInt(dropArea.getAttribute("for"));
                        // check the drop color area not was the current area for dropped bottle
                        console.log(id);
                        if (bottle.id != id) {
                            let goalBottle = bottles.filter(b => b.id == id);
                            // check the goal bottle is find or not
                            console.log(goalBottle);
                            if (goalBottle.length) {
                                goalBottle = goalBottle[0];
                                // check for the drop permissions
                                console.log(goalBottle.colors[0], bottle.colors[0], goalBottle.colors.length, (goalBottle.colors.length < 4 && goalBottle.colors[0] == bottle.colors[0]));
                                if (goalBottle.colors.length == 0 || (goalBottle.colors.length < 4 && goalBottle.colors[0] == bottle.colors[0])) {
                                    content.classList.add("ready");
                                    dropArea.classList.add("ready");
                                }
                            }
                        }
                    }
                }
                // move colors event
                dropArea.onclick = () => {
                    // if this drop area ready to move:
                    if (dropArea.className.includes("ready")) {
                        const id = parseInt(dropArea.getAttribute("for"));
                        // check the drop color area not was the current area for dropped bottle
                        if (bottle.id != id) {
                            let goalBottle = bottles.map((b, i) => { b.index = i; return b; }).filter(b => b.id == id);
                            // check the goal bottle is find or not
                            if (goalBottle.length) {
                                goalBottle = goalBottle[0];
                                bottle.HTML.children[1].children[0].children[0].classList.add("empty");
                                goalBottle.HTML.children[1].children[0].insertAdjacentHTML('afterbegin', `<li class='${bottle.colors[0]} fill' style='clip-path: polygon(0% 100%, 100% 100%, 0% 100000%, 0 100%)'></li>`);
                                bottles[goalBottle.index].addColor(bottle.colors[0], true);
                                bottles[index].shiftColor();
                                // make the empty effect
                                let empty1 = 0,
                                    empty2 = 0;
                                let emptyInterval = setInterval(() => {
                                    if (empty1 < 100) {
                                        empty1 += 0.6;
                                        empty2 += 0.3;
                                    }
                                    else if (empty2 < 100)
                                        empty2 += 0.6;
                                    else
                                        clearInterval(emptyInterval)
                                    bottle.HTML.children[1].children[0].children[0].style.clipPath = `polygon(0% ${empty2}%, 100% ${empty1}%, 0% 100000%, 0 100%)`;
                                }, 1);
                                // make the fill effect
                                let fill1 = 100,
                                    fill2 = 100;
                                let fillInterval = setInterval(() => {
                                    if (fill1 > 0) {
                                        fill1 -= 0.6;
                                        fill2 -= 0.3;
                                    }
                                    else if (fill2 > 0)
                                        fill2 -= 0.6;
                                    else {
                                        draw(true);
                                        return clearInterval(fillInterval)
                                    }
                                    goalBottle.HTML.children[1].children[0].children[0].style.clipPath = `polygon(0% ${fill2}%, 100% ${fill1}%, 0% 100000%, 0 100%)`;
                                }, 1);
                                // draw(true);
                            }
                        }
                    }
                }
            }
            // the bottle back to home event
            window.onclick = (e) => {
                if (!e.target.className.includes("dropArea") && e.target != content) {
                    content.classList.remove("dropped");
                    content.classList.remove("ready");
                    content.style.left = '0';
                    content.style.top = '0';
                }
            }
        }
    }
}
// draw the game board
const draw = (rebuild = false) => {
    let bottleArea = document.querySelector('.buttles');
    console.log('draw');
    bottleArea.innerHTML = '';
    console.log(bottles.length);
    for (let i = 0; i < bottles.length; i++) {
        let bottle = bottles[i];
        if (rebuild)
            // made the html of bottle
            bottle.madeHTML();
        bottleArea.append(bottle.HTML);
        // make the event for each drop color area
        eventForBottle(i);
    }
    if (CheckForWin(bottles)) {
        document.getElementById("main").style.display = 'none';
        document.getElementById("score").style.display = 'block';
    }
}

draw();