export const Auth = new class {
    /**
     * check the user is logged in
     * @returns if user logged in return true and if not returned false
     */
    check() {
        return localStorage.getItem("name") ? true : false;
    }
    login(name) {
        try {
            localStorage.setItem("name", name);
            return true;
        }
        catch {
            return false;
        }
    }
}

export const CheckForWin = (bottles) => {
    let uniques = 0;
    for (let i = 0; i < bottles.length; i++) {
        let bottle = bottles[i];
        let uniqeColors = [...new Set(bottle.colors)].length;
        if (uniqeColors == 1 && bottle.colors.length == 4) uniques++;
    }
    if (uniques == 4) {
        // store data in local storage
        let scores = JSON.parse(localStorage.getItem("scores") || "[]");
        scores.push({ date: new Date().toDateString(), name: localStorage.getItem("name"), time: window.timer });
        localStorage.setItem("scores", JSON.stringify(scores));
        const scoresContainer = document.getElementById("scores");
        scores.forEach(score => {
            scoresContainer.insertAdjacentHTML('beforeend', `<tr>
        <td>${score.date}</td>
        <td>${score.name}</td>
        <td>${score.time}</td>
    </tr>`);
        })
        return true;
    } else return false;
}