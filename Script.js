// Thanks a Lot To Eng: Osama Elzero
// _________________ Start all _________________
let parentDiv = document.querySelector(".tasks");
let tasksInput = document.querySelector("#tasksInput");
let addBtn = document.querySelector(".add-task");

// Accept Task On Enter
tasksInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

// Create New Empty Array To Store Objects In IT (And Clean Array After Reload)
let tasksArr = [];

// If There's Tasks In LocalStorage
if (localStorage.getItem("myTasks")) {
  // Push It To tasksArr As Array
  tasksArr = JSON.parse(localStorage.getItem("myTasks"));
  // Add It To Page And Ubdate LocalStorage
  addTask(tasksArr);
}

addBtn.addEventListener("click", () => {
  if (tasksInput.value !== "") {
    // Create Tasks Object
    const task = {
      id: Date.now(), // The Task Id Is The Date Of Its Creation
      name: tasksInput.value,
      completed: false, // The Task Is Not Done Yet
    };
    tasksArr.push(task);
    addTask(tasksArr);
    tasksInput.value = "";
  }
});

// Add Task Function
function addTask(arrOfTasks) {
  parentDiv.innerHTML = "";
  // Clear All Tasks divs Before Add New Becuase The addTask() Will Loop on
  // tasksArr And Create new Div (Task) For Each Object Stored In It
  // (For Not Adding The Same Task (Div) Again In Page)
  arrOfTasks.forEach((task) => {
    // Create The Task Div
    let taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.id = task.id;
    // Create Input Field For Task Name
    let taskName = document.createElement("input");
    taskName.type = "text";
    taskName.className = "task-name";
    taskName.value = task.name;
    taskName.spellcheck = false;
    taskDiv.appendChild(taskName);
    // Create Checkbox And Label
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let label = document.createElement("label");
    label.appendChild(document.createTextNode("Done"));
    // Create Caret Mark For Show Task Creation History
    let caret = document.createElement("i");
    caret.className = "fas fa-angle-down history-caret";
    caret.title = "Show This Task Creation History";
    // Create Delete Button
    let deleteBtn = document.createElement("span");
    deleteBtn.className = "delete";
    deleteBtn.appendChild(document.createTextNode("Delete"));
    // Create Options Div
    let optionsDiv = document.createElement("div");
    optionsDiv.className = "options";
    optionsDiv.appendChild(checkbox);
    optionsDiv.appendChild(label);
    optionsDiv.appendChild(caret);
    optionsDiv.appendChild(deleteBtn);
    taskDiv.appendChild(optionsDiv);
    parentDiv.appendChild(taskDiv);
  });
  // Set The Same Id For Checkbox And Checkbox Label
  let names = document.querySelectorAll(".task .task-name");
  names.forEach((name) => {
    let nameVal = name.value;
    let option = name.nextElementSibling;
    let input = option.querySelector("[type='checkbox']");
    let label = option.querySelector("label");
    input.id = nameVal;
    label.setAttribute("for", nameVal);
  });
  setInStorage();
  setClass();
}

// Set tasksArr In localStorage Function
function setInStorage() {
  localStorage.setItem("myTasks", JSON.stringify(tasksArr)); // Set As a String
}

parentDiv.addEventListener("click", (e) => {
  let parent = e.target.parentElement.parentElement;
  // Delete Task From Page And localStorage
  if (e.target.classList.contains("delete")) {
    tasksArr = tasksArr.filter(
      (task) => task.id != e.target.parentElement.parentElement.id
    );
    setInStorage(tasksArr);
    parent.remove();
  }
  // Toggle Completed Class On Elements And localSrorage
  if (e.target.getAttribute("for")) {
    for (let i = 0; i < tasksArr.length; i++) {
      if (tasksArr[i].id == parent.id) {
        tasksArr[i].completed === false
          ? (tasksArr[i].completed = true)
          : (tasksArr[i].completed = false);
        setInStorage(tasksArr);
      }
    }
    parent.classList.toggle("completed");
  }
  // Toggle .show-history class on task And Show History
  if (e.target.classList.contains("history-caret")) {
    if (!parent.classList.contains("show-history")) {
      parent.classList.add("show-history");
      // Create Span to Show Task Creation History
      let history = document.createElement("span");
      history.className = "history";
      history.appendChild(document.createTextNode(getTime(parent.id)));
      parent.appendChild(history);
    } else {
      document.querySelector(".history").remove();
      parent.classList.remove("show-history");
    }
  }
});

function getTime(parentId) {
  parentId = +parentId;
  let time = new Date(parentId);
  return time.toLocaleString();
}

// To Set Completed Class After Reload The Page
function setClass() {
  if (localStorage.getItem("myTasks") != "[]") {
    tasksArr.forEach((task) => {
      if (task.completed == true) {
        let divs = document.querySelectorAll(".task");
        divs.forEach((div) => {
          if (div.id == task.id) {
            div.classList.add("completed");
          }
        });
      }
    });
  }
}

setClass();
