# school-project-chat

This GitHub repo contains 1 folder.
- In the `website` folder is the `index` page (`html`) and a `src` folder
- The `src` folder includes the stylesheet (`css`), the scripts (`js`) and images or icons
- The website is built at school
- The websocket server is built at home (except the latest update(s))

> [!NOTE]
> You can find the repo of the server [here](https://github.com/samscript57377/simple-ws-chat-server)

---
# Information for the teacher (in dutch)
- [Hier](https://github.com/samscript57377/school-project-chat/commits/main/) is het logboek
- [Hier](https://github.com/samscript57377/simple-ws-chat-server) is de code van de server
- De reden dat alles in het engels staat is omdat ik gewend ben om in het engels te programmeren, maar ik heb een paar commentaren gemaakt in het nederlands

# Wat kan deze website
Het hoofddoel van deze website is met elkaar chatten in verschillende rooms. Je kan je naam en kleur veranderen in de settings. Je naam en kleur worden opgeslagen in de `localstorage`. Er wordt gebruik gemaakt van `WebSockets` om in `real-time` berichten te verzenden naar de server. Ook zijn er 2 soorten berichten, een systeem bericht en een gebruikersbericht. Die ene met de pijl is een systeembericht. Er is ook error handling voor als de server niet online is. je krijgt dan 2 berichten: Een dat er een error is en twee dat je gedisconnect bent met de server.
# Wat is er voor nodig
De server staat niet automatisch online, maar als je `nodeJS` hebt kan je de server klonen en op je `localhost` opstarten (staat niet automatisch open voor het internet). De server waar de website automatisch probeert naar te verbinden is de `localhost` op port `8080`, zie lijn 20 in de `SERVER_URL` variabele.
# Wat zou er nog aangepast aan kunnen worden
Ik zou in de toekomst dit kunnen updaten zodat je ook plaatjes kan versturen. Ik zou ook een vloek-filter toe kunnen voegen zodat er geen scheldwoorden gezegd kunnen worden of vloeken. Ook voor mensen die deze stijlen niet mooi vinden zou ik er thema's aan toe kunnen voegen (niet alleen `dark`/`light` thema).
---
> [!NOTE]
> Don't forget to follow my profile :D