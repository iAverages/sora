export const GET = (request: Request) => {
  const { headers, body } = request;

  return new Response("Hello world!");
};
