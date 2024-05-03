// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
      }
      const currentId = nextId;
      nextId += 1;
      localStorage.setItem("nextId", JSON.stringify(nextId));
    
      return currentId;
    }

// Todo: create a function to create a task card
function createTaskCard(newTask) {
    const card = $('<div>')
    .addClass('card')
    .attr('data-project-id', newTask.id)
    .attr('draggable', 'true'); 

const cardBody = $('<div>').addClass('card-body');

const cardTitle = $('<h5>').addClass('card-title').text(newTask.title);
cardBody.append(cardTitle);

const cardDescription = $('<p>').addClass('card-text').text(newTask.description);
cardBody.append(cardDescription);

const cardDueDate = $('<p>').text(newTask.dueDate);
cardBody.append(cardDueDate);

const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger btn-delete-task')
    .text('Delete');
cardBody.append(cardDeleteBtn);

card.append(cardBody);
if (newTask.dueDate && newTask.status !== 'done') {
    const now = dayjs();
    const due = dayjs(newTask.dueDate, "MM/DD/YYYY");
    
    if (due.isBefore(now, "day")) {
        card.addClass("task-late"); 
    }
    else if (due.diff(now, "day") <= 5) {
        card.addClass("task-today"); 
    }
    else {
    card.addClass("task-card");
    }
} 
return card;
};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
  
    taskList.forEach((task) => {
      const cardHtml = createTaskCard(task);
  
      switch (task.status) {
        case 'to-do':
          $('#todo-cards').append(cardHtml);
          break;
        case 'in-progress':
          $('#in-progress-cards').append(cardHtml);
          break;
        case 'done':
          $('#done-cards').append(cardHtml);
          break;
      }
    });
  
    $('.task-card').draggable({
      revert: 'invalid', 
      cursor: 'move',    
      start: function(event, ui) {
      }
    });
  
    $('.lane').droppable({
      accept: '.task-card',
      drop: handleDrop, 
    });
  }
$('#addTaskBtn').on('click', handleAddTask)
// Todo: create a function to handle adding a new task
function handleAddTask(event){ 
        const title = $('#task-title').val();
        const description = $('#task-desc').val();
        const dueDate = $('#task-due-date').val();
      
        const newTask = {
          id: generateTaskId(),
          title: title,
          description: description,
          dueDate: dueDate,
          status: 'to-do', 
        };
      
        let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));
      
        renderTaskList();
      
        $('#task-form')[0].reset(); 
        $('#formModal').modal('hide'); 
      }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.task-card').data('project-id');

  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList = taskList.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
        const taskId = ui.draggable.data('project-id');
        const newStatus = $(event.target).attr('id');
      
        let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
      
        taskList.forEach((task) => {
          if (task.id === taskId) {
            task.status = newStatus;
          }
        });
    
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#task-due-date').datepicker();
    $('#task-form').on('submit', handleAddTask);
    $(document).on('click', '.btn-delete-task', handleDeleteTask);
  });
