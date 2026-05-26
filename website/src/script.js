const messages = document.getElementById('messages');
const inputForm = document.getElementById('inputForm');
const chatInput = document.getElementById('chatInput');
const settingsPopup = document.getElementById('settingsPopup');
const namePopup = document.getElementById('changeNamePopup');
const colorPopup = document.getElementById('changeColorPopup');
const popupBG = document.getElementById('popupBackground');
const userNameInput = document.getElementById('usernameInput');
const colorInput = document.getElementById('colorInput');
const inRoomInfoItem = document.getElementById('inRoomInfo');
const roomInput = document.getElementById('roomInput');
const roomInputItem = document.getElementById('roomInfo');
const inRoomInfoDisplay = document.getElementById('roomDisplay');
const leaveRoomBtn = document.getElementById('leaveRoom');
const joinRoomBtn = document.getElementById('joinRoom');
const roomForm = document.getElementById('roomForm');
const welcomeScreen = document.getElementById('welcomeScreen');
const inputArea = document.getElementById('inputArea');

const SERVER_URL = "localhost:8080";

let isSettingsPopupOpen = false;
let isUsernamePopupOpen = false;
let isUsernameColorPopupOpen = false;

const socket = new WebSocket(`ws://${SERVER_URL}`);

socket.addEventListener('open', function (event) {
    console.info("Connected to the server!");
});

socket.addEventListener('error', function (event) {
    console.error("Websocket error: ", event);
    new Message("server", { text: "An error occurred with the websocket connection.", color: "#ff0000" });
});

socket.addEventListener('close', function (event) {
    console.info("Disconnected from the server!");
    new Message("server", { text: "You have been disconnected from the server.", color: "#ff0000" });
});

socket.addEventListener('message', function (event) {
    console.info('Message from server ', event.data);
    const data = JSON.parse(event.data);
    const message = data.message || data.props;
    
    if (data.type === 'message' || data.type === 'text') {
        new Message('text', { 
            name: message.sender?.username || message.name, 
            color: message.sender?.color || message.color || userColor,
            text: message.str || message.text 
        });
    } else if (data.type === 'join') {
        new Message('server', { 
            text: message.str || message.text, 
            color: message.sender?.color || '#9b39d5' 
        });
    } else if (data.type === 'emoji') {
        new Message('text', { 
            name: message.sender?.username || message.name, 
            color: message.sender?.color || message.color || userColor,
            text: message.emoji || message.text 
        });
    }
});

function getRoomFromUrl() {
    const roomCode = decodeURIComponent(
        window.location.search.replace(
            new RegExp(
                "^(?:.*[&\\?]" +
                encodeURIComponent("room")
                    .replace(
                        /[\.\+\*]/g, "\\$&")
                + "(?:\\=([^&]*))?)?.*$", "i"), "$1")
    );
    return roomCode
}

const roomCode = Number(getRoomFromUrl() || null);
console.info("Room code: ", roomCode || "Not in a room...");

if (roomCode) {
    inRoomInfoDisplay.textContent = roomCode;
    inRoomInfoItem.style.display = "flex";
    roomInputItem.style.display = "none";
    welcomeScreen.classList.add('hidden');
    // Send join message to server when connection is ready
    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({
            type: 'join',
            roomId: roomCode,
            username: userName
        }));
    }, { once: true });
} else {
    inRoomInfoItem.style.display = "none";
    roomInputItem.style.display = "flex";
    welcomeScreen.classList.remove('hidden');
    inputArea.style.display = "none";
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function getRandomRGB() {
    const r = getRandomInt(255);
    const g = getRandomInt(255);
    const b = getRandomInt(255);
    return `rgb(${r}, ${g}, ${b})`;
}

function generateName() {
    return "Guest" + Math.floor(Math.random() * 1000);
}

let userName = localStorage.getItem("userName") ?? generateName();
let userColor = localStorage.getItem("userColor") ?? getRandomRGB();

function setUserColor(color) {
    userColor = color;
    localStorage.setItem('userColor', userColor)
}

function setUserName(name) {
    userName = name;
    if (userName.toLowerCase().includes("admin")) {
        userName = generateName();
    }
    userName = userName.trim().split(" ").join("_");
    localStorage.setItem('userName', userName);
}

//verwijdert html karakters en zet karakters die erop lijken voor in de plaats
function escapeHTML(str) {
    const string = String(str).replace(/[&<>"']/g, function (match) {
        switch (match) {
            case "&": return "&amp;";
            case "<": return "&lt;";
            case ">": return "&gt;";
            case '"': return "&quot;";
            case "'": return "&#39;";
            default: return match;
        }
    });
    return string;
}

class Message {
    constructor(type, props) {
        this.type = type;
        this.props = props;
        const { name, color, text } = this.props;
        const msgContainer = document.createElement('div');
        msgContainer.classList.add('msgContainer');

        let messageEl = document.createElement('div');
        messageEl.classList.add('message');

        if (this.type === "text") {
            const displayName = name || 'Unknown User';
            messageEl.style.borderLeft = `solid 5px ${color}`;
            messageEl.innerHTML = `
                <h3>${escapeHTML(displayName)}</h3>
                <p>${text}</p>
            `;
        }

        if (this.type === "server") {
            messageEl.classList.remove('message')
            messageEl.innerHTML = `
                <h3>
                    <label style="color:${color}">&RightArrow; </label>
                    ${escapeHTML(text)}
                </h3>
            `;
        }

        msgContainer.appendChild(messageEl);
        messages.appendChild(msgContainer);
    }
}

function sendMessage() {
    const input = chatInput.value ?? "";
    if (input == "") return;
    const text = input.replace(/\n/g, "<br>")
    
    // Send message to server
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'message',
            roomId: roomCode || null,
            sender: { username: userName, color: userColor },
            str: text,
            style: { color: userColor }
        }));
    } else {
        console.error('WebSocket is not connected');
    }
    
    chatInput.value = "";
}

inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage();
})

chatInput.addEventListener("keydown", e => {
    e.preventDefault
    if (e.key === "Enter" && !e.shiftKey) {
        sendMessage();
    } else if (e.key === "Enter" && e.shiftKey) {
        const char = "\n";
        const start = chatInput.selectionStart;
        const end = chatInput.selectionEnd;

        chatInput.value =
            chatInput.value.slice(0, start) +
            char +
            chatInput.value.slice(end);
    }
});

function doPopupBG() {
    if (isSettingsPopupOpen || isUsernameColorPopupOpen || isUsernamePopupOpen) {
        popupBG.style.display = "block";
    } else {
        popupBG.style.display = "none";
    }
}

function toggleSettings() {
    isSettingsPopupOpen = !isSettingsPopupOpen;
    console.info("Setting visibility of the settings popup to ", isSettingsPopupOpen);
    if (isSettingsPopupOpen) {
        if (isUsernameColorPopupOpen) toggleColorPopup();
        if (isUsernamePopupOpen) toggleNamePopup();
    }
    settingsPopup.style.display = isSettingsPopupOpen ? "block" : "none";
    doPopupBG();
}

function toggleNamePopup() {
    isUsernamePopupOpen = !isUsernamePopupOpen;
    console.info("Setting visibility of the username popup to ", isUsernamePopupOpen);
    if (isUsernamePopupOpen) {
        if (isSettingsPopupOpen) toggleSettings();
        if (isUsernameColorPopupOpen) toggleColorPopup();
    }
    namePopup.style.display = isUsernamePopupOpen ? "block" : "none";
    doPopupBG();
}

function toggleColorPopup() {
    isUsernameColorPopupOpen = !isUsernameColorPopupOpen;
    console.info("Setting visibility of the color popup to ", isUsernameColorPopupOpen);
    if (isUsernameColorPopupOpen) {
        if (isSettingsPopupOpen) toggleSettings();
        if (isUsernamePopupOpen) toggleNamePopup();
    }
    colorPopup.style.display = isUsernameColorPopupOpen ? "block" : "none";
    doPopupBG();
}

function confirmNewUsername() {
    const newName = userNameInput.value;
    console.info('Changing username to ', newName);
    setUserName(newName);
    toggleNamePopup();
}

function confirmNewColor() {
    const newColor = colorInput.value;
    console.info('Changing color to ', newColor);
    setUserColor(newColor);
    toggleColorPopup();
}

roomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomCode = Number(roomInput.value);
    if (isNaN(roomCode)) return;
    window.location.search = `?room=${roomCode}`;
})

leaveRoomBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('hidden');
    window.location.search = "";
})

// Cleanup and leave message on page close
function sendLeaveMessage() {
    if (socket.readyState === WebSocket.OPEN && roomCode) {
        socket.send(JSON.stringify({
            type: 'leave',
            roomId: roomCode,
            sender: { username: userName, color: userColor }
        }));
    }
}

function cleanup() {
    sendLeaveMessage();
    if (socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
}

// Send leave message and cleanup on page unload
window.addEventListener('beforeunload', cleanup);
window.addEventListener('unload', cleanup);

document.getElementById('settingsBtn').addEventListener('click', toggleSettings);
document.getElementById('closeSettings').addEventListener('click', toggleSettings);

document.getElementById('openNamePopup').addEventListener('click', toggleNamePopup);
document.getElementById('nameConfirmBtn').addEventListener('click', confirmNewUsername);

document.getElementById('openColorPopup').addEventListener('click', toggleColorPopup);
document.getElementById('colorConfirm').addEventListener('click', confirmNewColor);