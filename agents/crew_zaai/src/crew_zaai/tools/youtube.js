const { BaseTool } = require('crewai/tools');
const { Field, BaseModel } = require('pydantic');
const { NoTranscriptFound, TranscriptsDisabled, YouTubeTranscriptApi } = require('youtube-transcript-api');

class YouTubeTranscriptToolInputSchema extends BaseModel {
    /**
     * Tool for fetching the transcript of a YouTube video using the YouTube Transcript API.
     * Returns the transcript with text, start time, and duration.
     */
    video_url = Field(String, { description: "URL of the YouTube video to fetch the transcript for." });
    language = Field(String, { description: "Language code for the transcript (e.g., 'en' for English).", required: false });
}

class YouTubeTranscriptToolOutputSchema extends BaseModel {
    /**
     * Output schema for the YouTubeTranscriptTool. Contains the transcript text, duration, comments, and metadata.
     */
    transcript = Field(String, { description: "Transcript of the YouTube video." });
    duration = Field(Number, { description: "Duration of the YouTube video in seconds." });
}

class YouTubeTranscriptTool extends BaseTool {
    /**
     * Tool for fetching the transcript of a YouTube video using the YouTube Transcript API.
     *
     * Attributes:
     *     input_schema (YouTubeTranscriptToolInputSchema): The schema for the input data.
     *     output_schema (YouTubeTranscriptToolOutputSchema): The schema for the output data.
     */
    name = "youtube_transcript_tool";
    description = "A tool to perform youtube transcript extraction. Specify the url of the youtube video and optionally the language code.";
    args_schema = YouTubeTranscriptToolInputSchema;

    constructor() {
        super();
    }

    async _run(video_url, language = null) {
        /**
         * Runs the YouTubeTranscriptTool with the given parameters.
         *
         * Args:
         *     video_url (string): The YouTube video URL to fetch the transcript for.
         *     language (string): The language code for the transcript (e.g., 'en' for English).
         *
         * Returns:
         *     YouTubeTranscriptToolOutputSchema: The output of the tool, adhering to the output schema.
         *
         * Raises:
         *     Exception: If fetching the transcript fails.
         */
        const video_id = this.extract_video_id(video_url);
        let transcripts;
        try {
            if (language) {
                transcripts = await YouTubeTranscriptApi.getTranscript(video_id, { languages: [language] });
            } else {
                transcripts = await YouTubeTranscriptApi.getTranscript(video_id);
            }
        } catch (e) {
            if (e instanceof NoTranscriptFound || e instanceof TranscriptsDisabled) {
                throw new Error(`Failed to fetch transcript for video '${video_id}': ${e.message}`);
            }
            throw e;
        }

        const transcript_text = transcripts.map(transcript => transcript.text).join(" ");
        const total_duration = transcripts.reduce((acc, transcript) => acc + transcript.duration, 0);

        return new YouTubeTranscriptToolOutputSchema({
            transcript: transcript_text,
            duration: total_duration,
        });
    }

    static extract_video_id(url) {
        /**
         * Extracts the video ID from a YouTube URL.
         *
         * Args:
         *     url (string): The YouTube video URL.
         *
         * Returns:
         *     string: The extracted video ID.
         */
        return url.split("v=")[1].split("&")[0];
    }
}

module.exports = YouTubeTranscriptTool;
