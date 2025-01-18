# AI Agents

**Steps to run the code:**
1. Ensure you have Node.js installed on your system. This project uses [npm](https://www.npmjs.com/) for dependency management and package handling.
2. Install npm if you haven't already:
```bash
npm install
```
3. Navigate to your project directory and install the dependencies:
```bash
npm install
```
4. Create a folder called `assets/` to store the results.
5. Add an .env file under `ai-agents/crew_zaai/src/crew_zaai/.env` with:
   ```
    YOUTUBE_API_KEY=<Your key>
    OPENAI_API_KEY=<Your key>
    SEARXNG_BASE_URL=https://search.zaai.ai
   ```
6. Run the main.js file:
```bash
node src/crew_zaai/main.js
```

## Folder Structure:
------------

    ├── crew_zaai
    │
    ├──── src/crew_zaai
    ├────── assets                      <- results
    ├────── config                      <- agent and tasks definition files
    ├────── tools                       <- tools to be used by the agents
    │
    │────── .env                        <- file with environment variables
    │
    │────── package.json                <- package version for installing
    │
    │────── crew.js                     <- crew definition
    └────── main.js                     <- file to generate the blog post
--------
