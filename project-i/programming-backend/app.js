import * as apiServices from "./services/apiService.js";
import { serve } from "./deps.js";
import { cacheMethodCalls } from "./utils/cacheUtil.js";
import { amqpConnect } from "./deps.js";

const cachedApiServices = cacheMethodCalls(
  apiServices,
  ["insertSubmission"],
);

const connectionOptions = {
  hostname: "mq",
  port: 5672,
};

let isReachable = false
let connection
let maxTry = 0;

while (isReachable === false && maxTry < 5){
  try{
    connection = await amqpConnect(connectionOptions);
    isReachable = true;
  }catch(e){
    maxTry++;
    console.log("app waits for mq...")
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

const channel = await connection.openChannel();
const queueName = "submission_queue";

const getAssignment = async (request, urlPatternResult) => {
  const id = urlPatternResult.pathname.groups.id;
  return Response.json(await cachedApiServices.getAssignmentById(id))
};

const getAllAssignments = async (request, urlPatternResult) => {
  return Response.json(await cachedApiServices.getAllAssignments())
};


const postSubmission = async (request) => {
  const requestData = await request.json();
  const user = requestData.user;
  const assignmentId = requestData.assignmentId;
  const code = requestData.code;

  const recordSubmissionId = await cachedApiServices
    .getSubmissionByAssignmentIdAndCode(assignmentId, code);


  if (!recordSubmissionId) {
    const submissionId = await cachedApiServices.insertSubmission(
      user,
      assignmentId,
      code,
    );

    const dicForPyGrade = {
      code: code,
      assignmentId: assignmentId,
      submissionId: submissionId
    };

    await channel.publish(
      { routingKey: queueName },
      { contentType: "application/json" },
      new TextEncoder().encode(JSON.stringify(dicForPyGrade)),
    );
      console.log("data published", dicForPyGrade)

    return Response.json({
      submissionId: submissionId,
    });
  }

  return Response.json({
    submissionId: recordSubmissionId,
  });
};

const getSSESubmission = async (request, urlPatternResult) => {
  const submissionId = urlPatternResult.pathname.groups.submissionId;

  let interval;

  const body = new ReadableStream({
    start(controller) {
      console.log(submissionId, "sse connection built (server side)")
      interval = setInterval(async() => {
        const submission = await cachedApiServices.getSubmissionById(submissionId);

        const messageData = JSON.stringify({
          submissionId: submissionId,
          status: submission.status,
          graderFeedback: submission.grader_feedback,
          correct: submission.correct
        })
        console.log(messageData)
        const message = new TextEncoder().encode(`data: ${messageData}\n\n`);
        controller.enqueue(message);
      }, 1000);
    },
    cancel() {
      console.log(submissionId, "sse connection closed (server side)")
      clearInterval(interval);
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "*",
      "Connection": "keep-alive",
    },
  });
}

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments/:id" }),
    fn: getAssignment,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments" }),
    fn: getAllAssignments,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submission" }),
    fn: postSubmission,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/sse/:submissionId" }),
    fn: getSSESubmission,
  }

];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) =>  um.method === request.method && um.pattern.test(request.url) ,
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e);
    return new Response(e.stack, { status: 500 });
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);