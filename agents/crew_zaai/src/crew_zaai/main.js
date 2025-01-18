const { CrewZaai } = require('./crew');
const dotenv = require('dotenv');

dotenv.config();

function run() {
    const inputs = { topic: "AI Agents" };
    new CrewZaai().crew().kickoff(inputs);
}

if (require.main === module) {
    run();
}
