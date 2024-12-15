import TaskManager from "./TaskManager";

const taskManager = new TaskManager();

document.addEventListener('DOMContentLoaded', taskManager.render());

document.querySelector('.manager').addEventListener('click', (e) => taskManager.control(e));



