export class Bottle {
    colors = [];
    constructor(id = 0) {
        this.id = id;
    }
    /**
     * add the color in the colors blocks
     * @param {*} color the color name
     * @returns if the put color was succesfuly return the true
     */
    addColor(color, unshift = false) {
        // in the bottle we shouldn't have more then 3 block of a same color
        if (unshift)
            return this.colors.unshift(color);
        else if (this.colors.filter(c => c == color).length < 3)
            return this.colors.push(color);
        return false;
    }
    shiftColor() {
        this.colors.shift();
    }
    madeHTML() {
        const div = document.createElement("div"), // parent div
            ul = document.createElement("ul"), // the parent of colors element
            dropArea = document.createElement("div"),
            content = document.createElement("div");
        div.className = 'buttle';
        dropArea.className = 'dropArea';
        dropArea.setAttribute("for", this.id);
        content.className = 'content';
        // put colors 
        this.colors.forEach(color => {
            const li = document.createElement("li"); // the color element
            li.className = color;
            ul.append(li);
        })
        content.append(ul);
        div.append(dropArea, content);
        this.HTML = div;
    }
}
export const Timer = () => {
    const timer = document.querySelector(".time");
    let time = 0,
        textTime = '00:00';
    setInterval(() => {
        time += 1000;
        let minutes = Math.floor((time / 1000) / 60),
            seconds = time / 1000 - (minutes * 60);
        textTime = `${minutes < 10 ? 0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
        window.timer = textTime;
        timer.innerHTML = textTime;
    }, 1000);
}