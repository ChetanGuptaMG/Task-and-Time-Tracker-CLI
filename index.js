#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import kleur from 'kleur';

const projectsFile = 'projects.json';

const projects = loadProjects();

function loadProjects() {
  try {
    const data = fs.readFileSync(projectsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveProjects() {
  fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
}

async function createProject() {
  const projectDetails = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the project name:',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter a brief project description:',
    },
  ]);

  projects.push({
    name: projectDetails.name,
    description: projectDetails.description,
    tasks: [],
  });

  saveProjects();
  console.log(kleur.green('Project created successfully!'));

  showMenu();
}

async function selectProject() {
  const projectChoices = projects.map((project) => ({
    name: project.name,
    value: project,
  }));

  const { selectedProject } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedProject',
      message: 'Select a project:',
      choices: projectChoices,
    },
  ]);

  return selectedProject;
}

async function createTask() {
  const selectedProject = await selectProject();

  const taskDetails = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the task name:',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter a brief task description:',
    },
    {
      type: 'number',
      name: 'hoursSpent',
      message: 'Enter the number of hours spent on this task:',
    },
  ]);

  selectedProject.tasks.push({
    name: taskDetails.name,
    description: taskDetails.description,
    hoursSpent: taskDetails.hoursSpent,
  });

  saveProjects();
  console.log(kleur.green('Task created successfully!'));

  showMenu();
}

async function listProjects() {
  console.log(kleur.blue('Your Projects:'));
  projects.forEach((project, index) => {
    console.log(kleur.white(`Project #${index + 1}`));
    console.log(kleur.white(`Name: ${project.name}`));
    console.log(kleur.white(`Description: ${project.description}`));
    console.log(kleur.white('Tasks:'));
    project.tasks.forEach((task, taskIndex) => {
      console.log(kleur.white(`Task #${taskIndex + 1}`));
      console.log(kleur.white(`Name: ${task.name}`));
      console.log(kleur.white(`Description: ${task.description}`));
      console.log(kleur.white(`Hours Spent: ${task.hoursSpent}`));
    });
  });

  showMenu();
}

async function showMenu() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select an option:',
      choices: [
        { name: 'Create a Project', value: 'create-project' },
        { name: 'Create a Task', value: 'create-task' },
        { name: 'List Projects', value: 'list-projects' },
        { name: 'Quit', value: 'quit' },
      ],
    },
  ]);

  switch (choice) {
    case 'create-project':
      createProject();
      break;
    case 'create-task':
      createTask();
      break;
    case 'list-projects':
      listProjects();
      break;
    case 'quit':
      console.log(kleur.cyan('Goodbye!'));
      break;
  }
}

function main() {
  console.log(kleur.magenta('Welcome to the Project Task and Time Tracker CLI Tool!'));
  if (!fs.existsSync(projectsFile)) {
    fs.writeFileSync(projectsFile, '[]', 'utf-8');
  }
  showMenu();
}

main();
