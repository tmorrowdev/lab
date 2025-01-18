const axios = require('axios');
const { BaseTool } = require('crewai');
const { z } = require('zod');

const SearxSearchToolInput = z.object({
    query: z.string().describe("The search query."),
    num_results: z.number().default(10).describe("The number of results to retrieve.")
});

class SearxSearchTool extends BaseTool {
    constructor(searx_host, unsecure = false) {
        super();
        this.name = "searx_search_tool";
        this.description = "A tool to perform searches using the Searx metasearch engine. Specify a query and optionally limit by engines, categories, or number of results.";
        this.args_schema = SearxSearchToolInput;
        this.searx_host = searx_host;
        this.unsecure = unsecure;
    }

    async _run({ query, num_results = 10 }) {
        try {
            const response = await axios.get(`${this.searx_host}/search`, {
                params: {
                    q: `${query} :youtube`,
                    format: 'json',
                    safesearch: 1,
                    categories: 'general',
                    engines: 'google',
                    pageno: 1,
                    language: 'en',
                    num_results: num_results
                },
                httpsAgent: new (require('https').Agent)({ rejectUnauthorized: !this.unsecure })
            });
            return response.data.results;
        } catch (error) {
            return [{ Error: error.message }];
        }
    }
}

module.exports = SearxSearchTool;
