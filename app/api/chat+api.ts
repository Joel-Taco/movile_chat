// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   console.log("Entro al endpoint!!!!");
//   console.log(messages);

//   const result = streamText({
//     model: openai('gpt-4o-mini'),
//     messages,
//   });

//   return result.toDataStreamResponse();
// }

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';


export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("Entro al endpoint!!!!");
  console.log(messages);

  const result = streamText({
    model: google('gemini-1.5-pro-latest'),
    messages,
  });
  
  return result.toDataStreamResponse();
}