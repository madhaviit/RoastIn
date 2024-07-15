// import { StreamingTextResponse, streamText } from "ai";
// import { createOpenAI } from "@ai-sdk/openai";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";
// import { exec } from 'child_process';
// import { Client } from "twitter-api-sdk";
// // const axios = require('axios');
// // import axios from "axios";
// const ratelimit =
// 	process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
// 		? new Ratelimit({
// 				redis: new Redis({
// 					url: process.env.KV_REST_API_URL,
// 					token: process.env.KV_REST_API_TOKEN,
// 				}),
// 				limiter: Ratelimit.slidingWindow(10, "5 m"),
// 				analytics: true,
// 				prefix: "RoastIn"
// 		  })
// 		: false;

// const groq = createOpenAI({
// 	apiKey: process.env.GROQ_API_KEY,
// 	baseURL: "https://api.groq.com/openai/v1",
// });

// export async function POST(req: Request) {
// 	if (ratelimit) {
// 		const ip = req.headers.get("x-real-ip") ?? "local";
// 		const rl = await ratelimit.limit(ip);

// 		if (!rl.success) {
// 			return new Response("Rate limit exceeded", { status: 429 });
// 		}
// 	}
	
// 	const { text, prompt } = await req.json();
// 	// const token_use=process.env.BEARER_TOKEN as string;
// 	// console.log(token_use);
// 	// 	const client = new Client(token_use);
	  
// 	// 	const response = await client.users.findUsersById({
// 	// 	  "ids": [
// 	// 		  "mkiitind"
// 	// 	  ],
// 	// 	  "user.fields": [
// 	// 		  "description",
// 	// 		  "location",
// 	// 		  "public_metrics",
// 	// 		  "url"
// 	// 	  ],
// 	// 	  "expansions": [
// 	// 		  "most_recent_tweet_id",
// 	// 		  "pinned_tweet_id"
// 	// 	  ]
// 	// 	});
		
// 	// 	console.log("response", JSON.stringify(response, null, 2));

// 	// const url = 'https://api.scrapingdog.com/linkedin/';
// 	// const params = {
// 	//     api_key: '6694afaad51a4154a59cd956',
// 	//     type: 'profile',
// 	//     linkId: 'madhav-kadam'
// 	// };

// 	// axios.get(url, { params: params })
// 	//     .then(response => {
// 	//         if (response.status === 200) {
// 	//             const data = response.data;
// 	//             console.log(data);
// 	//         } else {
// 	//             console.log(`Request failed with status code: ${response.status}`);
// 	//         }
// 	//     })
// 	//     .catch(error => {
// 	//         console.error('An error occurred:', error);
// 	//     });
	
// 	// const { exec } = require('child_process');

// 	// const api_key = process.env.SCP_API_KEY;
// 	// console.log(api_key);
// 	// const linkId = 'madhav-kadam';
// 	// const url = `https://api.scrapingdog.com/linkedin/?api_key=${api_key}&type=profile&linkId=${linkId}`;
	
// 	// exec(`curl "${url}"`, (error, stdout, stderr) => {
// 	// 	if (error) {
// 	// 		console.error(`Error executing curl: ${error.message}`);
// 	// 		return;
// 	// 	}
	
// 	// 	if (stderr) {
// 	// 		console.error(`stderr: ${stderr}`);
// 	// 		return;
// 	// 	}
	
// 	// 	console.log(`stdout: ${stdout}`);
// 	// });

// const https = require('https');
// const api_key = process.env.SCP_API_KEY;
// console.log(api_key);
// const linkId = text;
// const url = `https://api.scrapingdog.com/linkedin/?api_key=${api_key}&type=profile&linkId=${linkId}`;
// // var inpText;
// https.get(url, (resp) => {
//   let data = '';

//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   resp.on('end', () => {
//     const inpText=(JSON.parse(data));
//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });
// const { fullName, headline, about,followers } = inpText;

// const consider = `Name: ${fullName}
// Headline: ${headline}
// About: ${about}
// Followers: ${followers}`;
// // 	console.log(consider);
// 	// console.log(prompt);
// 	if (!prompt) return new Response("Prompt is required", { status: 400 });

// 	const result = await streamText({
// 		model: groq("llama3-8b-8192"),
// 		system: "You are a world class roaster and comedian. Use your roasting skills to roast the people based on their LinkedIn profile.Be offensive and yet enormously comic that one will laught until death. Provide a simple paragraph of 250 words.",
// 		// prompt: `Prompt: ${prompt}\nText: ${text}`,
// 		prompt: `${consider}`,
// 	});

// 	return new StreamingTextResponse(result.toAIStream());
// }



import { StreamingTextResponse, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { exec } from 'child_process';
import { Client } from "twitter-api-sdk";
import https from 'https';

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

// Function to fetch LinkedIn profile data
const fetchLinkedInProfile = (linkId: string, apiKey: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const url = `https://api.scrapingdog.com/linkedin/?api_key=${apiKey}&type=profile&linkId=${linkId}`;
        
        https.get(url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(JSON.parse(data));
				console.log(JSON.stringify(data));
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
};

export async function POST(req: Request) {
    if (ratelimit) {
        const ip = req.headers.get("x-real-ip") ?? "local";
        const rl = await ratelimit.limit(ip);
        if (!rl.success) {
            return new Response("Rate limit exceeded", { status: 429 });
        }
    }

    const { text, prompt } = await req.json();
    if (!prompt) return new Response("Prompt is required", { status: 400 });

    const api_key = process.env.SCP_API_KEY;
    if (!api_key) return new Response("API key is required", { status: 500 });

    try {
        const inpText = await fetchLinkedInProfile(text, api_key);
		// const inpText = [
		// 	{
		// 	  fullName: 'Madhav Kadam',
		// 	  linkedin_internal_id: '982166774',
		// 	  first_name: 'Madhav',
		// 	  last_name: 'Kadam',
		// 	  public_identifier: 'madhav-kadam',
		// 	  background_cover_image_url: 'https://media.licdn.com/dms/image/D5616AQEvW2C3OxF6iA/profile-displaybackgroundimage-shrink_200_800/0/1718797876620?e=2147483647&v=beta&t=d7pMM0QrQo_Fpn-R-2ycm94fdo9mQG_TgNlqiKKf-v4',
		// 	  profile_photo: 'https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2',
		// 	  headline: "MAGPIE Intern @Samsung Research (SRIB) | IIT Indore CSE '25",
		// 	  location: 'Kolhapur, Maharashtra, India\n          \n            Contact Info',
		// 	  followers: '2K followers',
		// 	  connections: '500+ connections',
		// 	  about: 'Proud Maharashtrian and a history buff. Enjoy talking and debating. Policy Research excites me.Passionate and inquisitive about the field of Generative AI, Computer Vision. Equally intrigued by the privacy and security aspects of technology, both in their development and application. Actively expanding my understanding in these areas. Foodie and nature lover. Always open to learning new things and collaborating for a cause.',
		// 	  experience: [
		// 		[Object], [Object],
		// 		[Object], [Object],
		// 		[Object], [Object],
		// 		[Object], [Object]
		// 	  ],
		// 	  education: [ [Object], [Object], [Object] ],
		// 	  articles: [],
		// 	  description: {
		// 		description1: 'Samsung R&D Institute India',
		// 		description1_link: 'https://in.linkedin.com/company/samsungrndindia?trk=public_profile_topcard-current-company',
		// 		description2: 'Indian Institute of Technology, Indore',
		// 		description2_link: 'https://in.linkedin.com/school/iit-indore/?trk=public_profile_topcard-school',
		// 		description3: ''
		// 	  },
		// 	  activities: [],
		// 	  volunteering: [ [Object], [Object] ],
		// 	  certification: [ [Object], [Object], [Object] ],
		// 	  people_also_viewed: [
		// 		[Object], [Object],
		// 		[Object], [Object],
		// 		[Object], [Object],
		// 		[Object], [Object],
		// 		[Object], [Object]
		// 	  ],
		// 	  similar_profiles: [ [Object], [Object], [Object], [Object], [Object] ],
		// 	  recommendations: [],
		// 	  publications: [],
		// 	  courses: [],
		// 	  languages: [ [Object], [Object], [Object], [Object], [Object] ],
		// 	  organizations: [],
		// 	  projects: [
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object],
		// 		[Object], [Object], [Object]
		// 	  ],
		// 	  awards: [ [Object], [Object], [Object], [Object] ],
		// 	  score: [ [Object], [Object], [Object], [Object], [Object] ]
		// 	}
		//   ]
		console.log(inpText);
        const { fullName, headline, about, followers, location } = inpText[0];
		
        const consider = `Name: ${fullName}
        Headline: ${headline}
        About: ${about}
        Followers: ${followers}
		Location: ${location}`;
		console.log(consider);
        const result = await streamText({
            model: groq("llama3-8b-8192"),
            system: "You are a world class roaster and comedian. Use your roasting skills to roast the people based on their LinkedIn profile. Be offensive and yet enormously comic that one will laugh until death. Provide a simple paragraph of 250 words.",
            prompt: `${consider}`,
        });

        return new StreamingTextResponse(result.toAIStream());
    } catch (error) {
        console.error("Error fetching LinkedIn profile:", error);
        return new Response("Failed to fetch LinkedIn profile or generate roast", { status: 500 });
    }
}