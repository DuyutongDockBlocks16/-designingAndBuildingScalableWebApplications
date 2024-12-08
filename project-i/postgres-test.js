import  postgres from "https://deno.land/x/postgresjs@v3.3.5/mod.js";

const CONCURRENT_CONNECTIONS = 20;

const sql = postgres(
    { 
        host: 'database-server',          // 数据库主机
        port: 5432,                 // 数据库端口 (默认是 5432)
        database: 'database',  // 数据库名称
        user: 'username',           // 用户名
        password: 'password',   // 密码
        max: CONCURRENT_CONNECTIONS 
    }
)

const title = "Hello";

// const query = `SELECT * FROM programming_assignments WHERE title=${title}`

const query = `SELECT * FROM public.programming_assignments`;

const response = {};

try {
    console.log(query);
    const results = await sql`SELECT * FROM public.programming_assignments WHERE title=${title}`;
    console.log(results);

    response.rows = results[0];
} catch (e) {
    console.log(e);
    response.error = e;
}

console.log(response);


// deno run --allow-net --allow-env postgres-test.js 
// deno run --allow-net --allow-env test.js 
// psql -h localhost -U username -d database
// \dt
// select * from public.programming_assignments;
// select * from public.programming_assignment_submissions;