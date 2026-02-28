# school-project-chat

This GitHub repo contains 2 folders, website and websocket server.
- The website is built at school
- The websocket server is built at home

> [!NOTE]
> The tests (index.test.js) are generated using AI and can be run with `npx jest` (if installed). The server (index.js) is created by myself.


> [!WARNING]
> The node package has NOT initiated yet. Follow the instructions below if you want to.

# Server setup
First, make sure you have Node.js installed.
Then, open the terminal (Linux), or the command prompt (Windows).
- First, navigate to the websocket-server directory
- Then, run `npm init -y`, to create a `package.json`
- After that, install the following dependencies:
- 1. Install ws (Websocket library) and crypto (library for hashing passwords or random uuids) by running `npm install ws crypto` in the websocket-server directory.
- 2. Install jest (a library for tests) as a dev-dependency with `npm install jest --save-dev`, or skip this if you dont want to run tests.