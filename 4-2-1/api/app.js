const items = [];

const handleGetRoot = async (request) => {
    return new Response("Hello world at root!");
};

const handleGetItem = async (request, urlPatternResult) => {
    const id = urlPatternResult.pathname.groups.id;
    // trying to respond with an item at index id
    return Response.json(items[id]);
};

const handleGetItems = async (request) => {
    return Response.json(items);
};

const handlePostItems = async (request) => {
    const item = await request.json();
    items.push(item);
    return new Response("OK", { status: 200 });
};

const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/items/:id" }),
        fn: handleGetItem,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/items" }),
        fn: handleGetItems,
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/items" }),
        fn: handlePostItems,
    },
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/" }),
        fn: handleGetRoot,
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
}

const portConfig = { port: 7777 };

Deno.serve(portConfig, handleRequest);