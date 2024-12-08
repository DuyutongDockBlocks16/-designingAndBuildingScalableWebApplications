import { sql } from "../database/database.js";


const insertSubmission = async (user_uuid, programming_assignment_id, code) => {

  const res = await sql`INSERT INTO programming_assignment_submissions (programming_assignment_id, code, user_uuid) VALUES (${programming_assignment_id} , ${code}, ${user_uuid}) RETURNING id`

  return res[0].id;
};


const getSubmissionByAssignmentIdAndCode = async (programming_assignment_id, code) => {
  const exist = await sql`SELECT * FROM programming_assignment_submissions WHERE programming_assignment_id = ${programming_assignment_id} AND code = ${code}`

  if (exist.length > 0) {
    console.log(exist)
    return exist[0].id;
  }

  return null;
};


const getSubmissionById = async (id) => {
  const res = await sql`SELECT * FROM programming_assignment_submissions WHERE id=${id};`;

  return res[0];
};

const getAssignmentById = async (id) => {
  const res = await sql`SELECT id, title, assignment_order, handout FROM programming_assignments WHERE id=${id};`;

  return res[0];
};

const getAllAssignments = async () => {
  const res = await sql`SELECT id, assignment_order FROM programming_assignments;`;

  return res;
};

export { insertSubmission, getSubmissionByAssignmentIdAndCode, getSubmissionById, getAssignmentById, getAllAssignments };
