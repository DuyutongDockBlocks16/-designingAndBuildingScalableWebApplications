// TODO
import {postgres} from "./deps";
const sql = postgres({});
// psql -h localhost -U username -d database -p 5432
/*
CREATE TABLE todos (
   id SERIAL PRIMARY KEY,
   item TEXT NOT NULL
);
*/

// curl -X POST http://localhost:7777/todos -H "Content-Type: application/json" -d '{"item": "testitem2"}'

const handleGetItems = async (request) => {

    const items = await sql`SELECT * FROM todos`;

    // throw new Error(`items: ${JSON.stringify(items)}`);
    // {"id":1,"item":"Item: 94228"}
    // {"id":2,"item":"Item: 92344"}

    return Response.json(items);
};

const handleGetItem = async (request, urlPatternResult) => {

    const id = urlPatternResult.pathname.groups.id;
    const items = await sql`SELECT * FROM todos WHERE id = ${id}`;

    if (items.length === 0) {
        return new Response("Not Found", { status: 404 });
    }

    const transformedItem = { [items[0].id]: items[0].item };
    return Response.json(transformedItem);
};

const handlePostItems = async (request) => {
    try {
        const text = await request.json();
        console.log("Received request body:", text); // Debugging line

        if (!text.hasOwnProperty('item') || !text.item.trim()) {

            console.log(text.item)

            throw new Error(`Invalid item`);
        }

        await sql`INSERT INTO todos (item) VALUES (${text.item})`;

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error); // Debugging line
        return new Response("Invalid JSON or missing/empty 'name'", { status: 400 });
    }
};


const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handleGetItems,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/todos/:id" }),
        fn: handleGetItem,
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handlePostItems,
    },

];

const handleRequest = async (request) => {
    const mapping = urlMapping.find(
        (um) => um.method === request.method && um.pattern.test(request.url)
    );

    if (!mapping) {
        return new Response("Not found", { status: 404 });
    }

    const mappingResult = mapping.pattern.exec(request.url);
    return await mapping.fn(request, mappingResult);
};



Deno.serve({ port: 7777 }, handleRequest);
