let doors = {};
let positions = [10, 1, 4, 5, 18, 2, 3, 22, 6, 25, 7, 19, 9, 11, 15, 13, 14, 16, 23, 20, 21, 24, 8, 12];
const videos = [
    "fer-sniaghtee",
    "giootyn",
    "fer-arran-jinshar",
    "maidjey-millish",
    "hollyn",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?",
    "?"
];

let limit = videos.filter(e => e != "?").length;

function storeOpened () {
    const doorsJSON = JSON.stringify(doors);
    localStorage.setItem("doors", doorsJSON);
};

function checkDoors () {
    doors = JSON.parse(localStorage.getItem("doors")) ?? doors;
    for (const door in doors) {
        const doorToOpen = document.getElementById(`door-${door}`);
        if (doors[door].opened) openDoor(null, door, doorToOpen);
    };
};
window.addEventListener("load", checkDoors);

function playVideo (event, n) {
    showStars(event);
    const containerDets = document.getElementById("calendar-container").getBoundingClientRect();
    const startPos = event.target.getBoundingClientRect();
    let startCoords = [];
    startCoords[0] = startPos.left + 5;
    startCoords[1] = startPos.top + 15;
    const videoContainer = document.getElementById(`video-container-${n}`);
        videoContainer.style.pointerEvents = "none";
        videoContainer.style.left = startCoords[0] - containerDets.left + "px";
        videoContainer.style.top = startCoords[1] + "px";
        videoContainer.style.transition = ".6s ease-in-out";
        videoContainer.style.visibility = "visible";
        videoContainer.style.width = "100%";
        videoContainer.style.height = "100%";
        videoContainer.style.zIndex = "3";
        videoContainer.style.transform = `translate(-${(startCoords[0] - containerDets.left)}px, -${startCoords[1]}px)`;
        const video = document.getElementById(`video-${n}`);
        video.currentTime = 0;
        video.play();
        setTimeout(() => {
            videoContainer.style.pointerEvents = "auto";
            setWindowImage(n);
        }, 600);
}

function showStars(event) {
    const starContainer = document.getElementById("star-container");
    setTimeout(() => starContainer.style.visibility = "hidden", 600);
    starContainer.style.visibility = "visible";
    const clickPos = [event.clientX, event.clientY];
    starContainer.style.transform = `translate(${clickPos[0]}px, ${clickPos[1]}px`;
    const stars = [...document.getElementsByClassName("star")];
    stars.forEach(s => {
        const anim = Math.floor(Math.random() * 6) + 1;
        s.classList.add(`star-anim-${anim}`);
        setTimeout(() => {
            s.classList.remove(`star-anim-${anim}`);
        }, 600);
    });
    let opac = 1;
    const reduceOpac = setInterval(() => {
        opac -= .2;
        stars.forEach(s => s.style.opacity = opac);
        if (opac <= 0) clearInterval(reduceOpac);
    }, 100);
};

function setWindowImage (n) {
    const currentWindow = document.getElementById(`window-${n}`);
    currentWindow.style.backgroundImage = `url("caslyssyn/${videos[n - 1]}.webp")`;
}

function openDoor (event, n, door) {
    const today = new Date();
    const todayDate = 11;
    // if (todayDate < n) return;
    if (n > limit) return;
    const target = event ? event.target : door;
    if (!doors[n].opened || door) {
        doors[n].opened = true;
        storeOpened();
        target.style.backgroundColor = "var(--nollick-bane)";
        target.classList.add("door-anim");
        const currentWindow = document.getElementById(`window-${n}`);
        currentWindow.style.backgroundColor = "var(--nollick-doo)";
        if (event) playVideo(event, n);
        else setWindowImage(n);
    };
};

function makeCalendar () {
    const calendarContainer = document.getElementById("calendar-container");
        const calendarTop = document.createElement("div");
            calendarTop.id = "calendar-top";
            calendarTop.textContent = "Nollick Ghennal!";
    calendarContainer.append(calendarTop);
    for (let i = 0; i < 25; i++) {
            let count = i + 1;
            if (count == 25) break;
            let pos = positions[count - 1];
            doors[count] = {
                position: pos,
                coords: [(pos % 5) + 1, Math.ceil((pos / 5)) + 1],
                opened: false
            };
            const currentWindow = document.createElement("div");
                currentWindow.id = `window-${count}`;
                currentWindow.classList.add("calendar-window");
                currentWindow.style.gridColumn = doors[count].coords[0];
                currentWindow.style.gridRow = `${doors[count].coords[1]}${count == 24 ? "/ span 2" : ""}`;
                currentWindow.addEventListener("click", event => {
                    if (doors[count].opened) {
                        event.target.style.backgroundSize = "50px 50px";
                        setTimeout(() => {
                            event.target.style.visibility = "hidden";
                            event.target.style.backgroundSize = "125% 100%";
                            playVideo(event, count);
                        }, 300);
                    };
                });
            let videoContainer;
            if (count < limit + 1) {
                videoContainer = document.createElement("div");
                    videoContainer.id = `video-container-${count}`;
                    videoContainer.classList.add("video-container");
                    videoContainer.addEventListener("click", event => {
                        event.target.style.transition = "unset";
                        event.target.style.visibility = "hidden";
                        event.target.style.width = "50px";
                        event.target.style.height = "50px";
                        event.target.style.transform = "translate(0, 0)";
                        currentWindow.style.visibility = "visible";
                    });
                    const video = document.createElement("video");
                    video.id = `video-${count}`;
                    video.classList.add("calendar-video");
                        const videoSource = document.createElement("source");
                        videoSource.type = "video/mp4";
                        videoSource.src = `feeshanyn/${videos[count - 1]}.mp4`;
                    video.appendChild(videoSource);
                videoContainer.append(video);
            };
            const door = document.createElement("div");
                door.id = `door-${count}`;
                door.classList.add("calendar-door");
                door.style.gridColumn = doors[count].coords[0];
                door.style.gridRow = `${doors[count].coords[1]}${count == 24 ? "/ span 2" : ""}`;
                door.addEventListener("click", event => openDoor(event, count));
                    const number = document.createElement("div");
                        number.classList.add("number");
                        number.textContent = count;
                door.append(number);
            calendarContainer.append(currentWindow);
            if (count < limit + 1) calendarContainer.append(videoContainer);
            calendarContainer.append(door);
    };
        const calendarBottom = document.createElement("div");
            calendarBottom.id = "calendar-bottom";
                sgLogo = document.createElement("img");
                    sgLogo.id = "sg-logo";
                    sgLogo.src = "caslyssyn/sg-logo.webp";
                    let clickCount = 0;
                    let clickTime = 700;
                    let countdown;
                    sgLogo.addEventListener("click", () => {
                        counting = true;
                        clickCount++;
                        clickTime = 700;
                        clearInterval(countdown);
                        countdown = setInterval(() => {
                            clickTime -= 100;
                            if (clickTime == 0) {
                                clearInterval(countdown);
                                clickTime = 700;
                                clickCount = 0;
                            };
                        }, 100);
                        console.log(clickCount);
                        if (clickCount == 6) {
                            console.log('here')
                            localStorage.clear();
                            location.reload();
                        };
                    });
                cBA = document.createElement("div");
                    cBA.id = "cba";
                    cBA.textContent = "as";
                cBB = document.createElement("div");
                    cBB.id = "cbb";
                    cBB.textContent = "Blein Vie Noa!";
                bngLogo = document.createElement("img");
                    bngLogo.id = "bng-logo";
                    bngLogo.src = "caslyssyn/bng-logo.webp";
            calendarBottom.append(cBA, cBB);
    calendarContainer.append(sgLogo, calendarBottom, bngLogo);
    const starContainer = document.createElement("div");
    starContainer.id = "star-container";
    for (let i = 0; i < 9; i++) {
        const star = document.createElement("img");
            star.classList.add("star");
            star.src = "caslyssyn/rollage.webp";
            star.style.left = `${i * 2}px`;
            star.style.top = `${Math.sin(i)*10}px`;
        starContainer.append(star);
    };
    document.body.append(starContainer);
};
makeCalendar();
