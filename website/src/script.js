const messages = document.getElementById('messages');
const inputForm = document.getElementById('inputForm');
const chatInput = document.getElementById('chatInput');
const settingsPopup = document.getElementById('settingsPopup');
const namePopup = document.getElementById('changeNamePopup');
const colorPopup = document.getElementById('changeColorPopup');

let isSettingsPopupOpen = false;
let isUsernamePopupOpen = false;
let isUsernameColorPopupOpen = false;

let userName = localStorage.getItem("userName") ?? prompt("Please enter your username...");

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
            messageEl.style.borderLeft = `solid 5px ${color}`;
            messageEl.innerHTML = `
                <h3>${escapeHTML(name)}</h3>
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
    const input = escapeHTML(chatInput.value ?? "");
    if (input == "") return;
    const text = input.replace("\n", "<br>")
    let message = new Message('text', { name: userName, color: "red", text: text });
    chatInput.value = "";
    return message
}

inputForm.addEventListener('submit', (event) => {
    event.preventDefault()
    sendMessage()
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

function doPopupBG () {

}

function toggleSettings() {
    isSettingsPopupOpen = !isSettingsPopupOpen;
    console.info("Setting visibility of the settings popup to ",isSettingsPopupOpen);
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
    console.info("Setting visibility of the color popup to ",isUsernameColorPopupOpen);
    if (isUsernameColorPopupOpen) {
        if (isSettingsPopupOpen) toggleSettings();
        if (isUsernamePopupOpen) toggleNamePopup();
    }
    colorPopup.style.display = isUsernameColorPopupOpen ? "block" : "none";
    doPopupBG();
}

document.getElementById('settingsBtn').addEventListener('click', toggleSettings())