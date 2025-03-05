
export async function GET() { 
  console.log("Entro al endpoint!!!!");
  return new Response(JSON.stringify({
    message: 'Hello World'
  }));
}