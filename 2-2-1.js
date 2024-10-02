const items = [];

const handleGetItems = async (request) => {
    return Response.json(items);
};

const handlePostItems = async (request) => {
    try {
        const item = await request.json();
        items.push(item);
        return new Response("OK", { status: 200 });
    } catch (error) {
        return new Response("Invalid JSON", { status: 400 });
    }
};


const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handleGetItems,
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/todos" }),
        fn: handlePostItems,
    }
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
