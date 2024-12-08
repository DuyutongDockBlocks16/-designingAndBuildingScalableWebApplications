import { readable, writable } from "svelte/store";

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
} 

const userUuid = readable(user);

let storedCurrentAssignment = localStorage.getItem("currentAssignment")

if(!storedCurrentAssignment) {
  storedCurrentAssignment = 1;
  localStorage.setItem("currentAssignment", storedCurrentAssignment);
}

const currentAssignment = writable(storedCurrentAssignment)

currentAssignment.subscribe(value => {
  localStorage.setItem("currentAssignment", value);
})


export {userUuid, currentAssignment};