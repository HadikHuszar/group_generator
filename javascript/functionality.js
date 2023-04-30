const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);
const generatePairsElement = document.querySelector("[generate-pairs]");
const alphabetizeMembersElement = document.querySelector(
  "[alphabetize-members]"
);

const LOCAL_STORAGE_LIST_KEY = "member.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "member.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

generatePairsElement.addEventListener("click", () => generatePairs());

alphabetizeMembersElement.addEventListener("click", () => alphabetizeMembers());

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
});

deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find((list) => list.id === selectedListId);

  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "member" : "members";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} in group`;
  console.log({ selectedList });
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Get all buttons with class name "myButton"
var buttons = document.querySelectorAll(".groupsize-button");
var currentValue = 2;

// Add click event listener to each button
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    if (currentValue === 2) {
      currentValue = 3;
    } else if (currentValue === 3) {
      currentValue = 4;
    } else if (currentValue === 4) {
      currentValue = 2;
    }
    this.textContent = currentValue;
  });
});

// ------------  Shuffle Pair Generator ------------- //

function extractData(data) {
  console.log({ data });
  console.log("selectedListId", selectedListId);
  const cohort = [];
  const selectedGroupData = data.find((group) => group.id === selectedListId);
  const tasks = selectedGroupData.tasks;
  for (i = 0; i < tasks.length; i++) {
    if (!tasks[i].complete) {
      cohort.push(tasks[i].name);
    }
  }

  return cohort;
}

function generatePairs() {
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));
  const cohort = extractData(data);
  const shuffledCohort = shuffle(cohort);
  const pairs = pair(shuffledCohort);

  console.log("pairs", pairs);

  presentElementsToDOM(pairs);
}

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function pair(data) {
  const pairs = [];
  let groupNumber = parseInt(buttons[0].textContent);

  console.log(buttons);

  for (let i = 0; i < data.length; i = i + groupNumber) {
    if (
      data.length % groupNumber !== 0 &&
      i === data.length - (groupNumber + 1)
    ) {
      pairs.push(data.slice(i, i + (groupNumber + 1)));
      i++;
    } else {
      pairs.push(data.slice(i, i + groupNumber));
    }
  }
  return pairs;
}

function presentElementsToDOM(pairedData) {
  if (document.getElementById("pairgroups_child")) {
    document
      .getElementById("pairgroups")
      .removeChild(document.getElementById("pairgroups_child"));
  }

  const container = document.createElement("div");

  container.id = "pairgroups_child"; // Create a new <div> element to contain all the elements

  // Loop through each paired group in the array and add it to the container
  for (let i = 0; i < pairedData.length; i++) {
    const groupName = "Group " + (i + 1); // Create the group name
    const groupMembers = pairedData[i].join(", "); // Create the group members string
    const groupLabelElement = document.createElement("span"); // Create a new <span> element for the group label
    groupLabelElement.textContent = groupName + ":  "; // Set the text content of the group label
    groupLabelElement.classList.add("group-label"); // Add a CSS class to the group label
    container.appendChild(groupLabelElement); // Add the group label to the container

    const groupMembersElement = document.createElement("span"); // Create a new <span> element for the group members

    groupMembersElement.textContent = groupMembers; // Set the text content of the group members element

    container.appendChild(groupMembersElement); // Add the group members element to the container

    container.appendChild(document.createElement("br")); // Add a line break after the group members
  }

  document.getElementById("pairgroups").appendChild(container);
  // Add the container to the <body> element of the document
}

function alphabetizeMembers() {
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY));

  const selectedGroupData = data.find((group) => group.id === selectedListId);
  const tasks = selectedGroupData.tasks;
  const alphabetizedTasks = alphabeticSorter(tasks);

  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = alphabetizedTasks;

  saveAndRender();
}

function alphabeticSorter(data) {
  if (data.length > 0) {
    // Sort tasks array alphabetically by name
    return data.sort(function (a, b) {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  return data;
}

render();
