const { Agent, Crew, Process, Task } = require('crewai');
const { CrewBase, agent, crew, task } = require('crewai/project');
const SearxSearchTool = require('./tools/searx');
const YouTubeTranscriptTool = require('./tools/youtube');
const dotenv = require('dotenv');

dotenv.config();

class CrewZaai {
    constructor() {
        this.agentsConfig = require('./config/agents.yaml');
        this.tasksConfig = require('./config/tasks.yaml');
    }

    researcher() {
        const searchTool = new SearxSearchTool({
            searxHost: process.env.SEARXNG_BASE_URL,
            unsecure: false
        });

        return new Agent({
            config: this.agentsConfig.researcher,
            tools: [searchTool],
            verbose: true
        });
    }

    summarizer() {
        const youtubeTool = new YouTubeTranscriptTool();

        return new Agent({
            config: this.agentsConfig.summarizer,
            tools: [youtubeTool],
            verbose: true
        });
    }

    blogWriter() {
        return new Agent({
            config: this.agentsConfig.blog_writer,
            verbose: true
        });
    }

    researchTask() {
        return new Task({
            config: this.tasksConfig.research_task
        });
    }

    summarizerTask() {
        return new Task({
            config: this.tasksConfig.summarize_task
        });
    }

    writeTask() {
        return new Task({
            config: this.tasksConfig.write_task,
            outputFile: 'assets/report.html'
        });
    }

    crew() {
        return new Crew({
            agents: this.agents,
            tasks: this.tasks,
            process: Process.sequential,
            verbose: true
        });
    }
}

module.exports = CrewZaai;
