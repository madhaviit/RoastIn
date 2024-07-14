import { StreamingTextResponse, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit =
	process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
		? new Ratelimit({
				redis: new Redis({
					url: process.env.KV_REST_API_URL,
					token: process.env.KV_REST_API_TOKEN,
				}),
				limiter: Ratelimit.slidingWindow(10, "5 m"),
				analytics: true,
				prefix: "RoastIn"
		  })
		: false;

const groq = createOpenAI({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
	if (ratelimit) {
		const ip = req.headers.get("x-real-ip") ?? "local";
		const rl = await ratelimit.limit(ip);

		if (!rl.success) {
			return new Response("Rate limit exceeded", { status: 429 });
		}
	}
	
	const { text, prompt } = await req.json();
	// console.log(text);
	// console.log(prompt);
	if (!prompt) return new Response("Prompt is required", { status: 400 });

	const result = await streamText({
		model: groq("llama3-8b-8192"),
		system: "You are a world class roaster and comedian. Use your roasting skills to roast the people based on their LinkedIn profile.Be offensive and yet enormously comic that one will laught until death. Provide a simple paragraph of 250 words.",
		// prompt: `Prompt: ${prompt}\nText: ${text}`,
		prompt: `${text}`,
	});

	return new StreamingTextResponse(result.toAIStream());
}
