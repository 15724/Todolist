let todos = [];
const STOGRAGE_KEY = 'todos'
const input = document.querySelector('.input_todo');
const button = document.querySelectorAll('button');


const btn_add = document.querySelector('.todo_add');
const btn_complete = document.querySelector('.todo_complete');
const btn_incomplete = document.querySelector('.todo_incomplete');
const btn_todo_all = document.querySelector('.todo_all');



function addTodo(newTodo) {

    const ol = document.querySelector('.list')
    const li = document.createElement('li');
    const btn_content = document.createElement('button');
    const btn_delete = document.createElement('button');

    li.classList.add('todo-row')
    btn_content.classList.add('todo_content')
    btn_delete.classList.add('todo_delete')

    ol.appendChild(li)
    li.appendChild(btn_content)
    li.appendChild(btn_delete)

    btn_content.innerText = newTodo;

    btn_delete.addEventListener('click', deleteTodo);
    btn_content.addEventListener('click', completeTodo);
}



const form = document.querySelector('.form');
function todoSubmit(event) {
    event.preventDefault();
    const newTodo = input.value;
    input.value = "";

    if (newTodo.trim() !== "" && newTodo !== null) {
        addTodo(newTodo);

        todos.push({
            todo: newTodo,
            complete: false
        })
    }
    saveTodo();
}

let btn_completed_clicked = false;
function loadTodoComplete() {  //완료 버튼 누르면 미완료 부분은 삭제

    //미완료 버튼 누른 다음 미완료한 할 일만 화면에 있는 경우

    if (btn_incompleted_clicked) {
        const incompleteTodoCount = document.querySelectorAll('.todo-row').length
        showTodo.forEach(el => {
            addTodo(el);
            Array.from(document.querySelectorAll('.todo-row')).slice(incompleteTodoCount).forEach(e => e.classList.add('complete'));

        })
    }

    btn_incompleted_clicked = false;

    if (!btn_completed_clicked) {
        showTodo = [];
        const incompleted = document.querySelectorAll('li:not(.complete)');
        incompleted.forEach(el => {
            showTodo.push(el.innerText);
            el.classList.add('remove');
            el.addEventListener("transitionend", () => {
                el.remove();
            })

        })
    }
    btn_completed_clicked = true;


}

form.addEventListener('submit', todoSubmit)

const savedTodos = localStorage.getItem(STOGRAGE_KEY)
if (savedTodos !== null) {
    const parsedTodos = JSON.parse(savedTodos);
    todos = parsedTodos;
    parsedTodos.forEach(e => addTodo(e.todo))
}

todos.forEach((e, i) => {
    if (e.complete) {
        document.querySelectorAll('.todo-row')[i].classList.add('complete');
    }
})



function saveTodo() {
    localStorage.setItem(STOGRAGE_KEY, JSON.stringify(todos));
}

let showTodo = [];
let btn_incompleted_clicked = false;

function loadTodoInComplete() {

    if (btn_completed_clicked) showTodo.forEach(el => {
        addTodo(el);
    })

    if (!btn_incompleted_clicked) {
        showTodo = [];

        let removecomplete = document.querySelectorAll('.complete');
        removecomplete.forEach(el => {
            showTodo.push(el.innerText);
            el.classList.add('remove');
            el.addEventListener("transitionend", () => {
                el.remove();
            })

        });
    }
    btn_completed_clicked = false;
    btn_incompleted_clicked = true;
}





function completeTodo(e) {
    const completed = e.target;
    completed.parentNode.classList.toggle('complete');

    if (completed.parentNode.classList.contains('complete')) {
        let completeIndex = todos.findIndex(x => x.todo === completed.outerText);
        todos[completeIndex].complete = true;
        saveTodo();
    }

}


function deleteTodo(e) {

    const todo = e.target.previousSibling;
    const deleteButton = e.target;
    const todo_text = todo.outerText;
    const index = todos.findIndex(x => x.todo === todo_text);
    todos.splice(index, 1);
    const removeTodo = e.target.parentNode;
    removeTodo.remove();
    const key = removeTodo.childNodes[0].innerHTML;
    localStorage.removeItem(key);
    saveTodo();
}


function loadTodoAll() {
    btn_completed_clicked = false;

    const remainTodoCount = document.querySelectorAll('.todo-row').length;
    //todos.forEach(e => todoAll.push(e.todo))

    if (todos.length > remainTodoCount) {

        showTodo.forEach(e => {
            addTodo(e);

            if (btn_incompleted_clicked) {
                Array.from(document.querySelectorAll('.todo-row')).slice(remainTodoCount).forEach(e => e.classList.add('complete'));

            }

        })
        btn_incompleted_clicked = false;
    }
}


btn_complete.addEventListener('click', loadTodoComplete);
btn_incomplete.addEventListener('click', loadTodoInComplete);
btn_todo_all.addEventListener('click', loadTodoAll);






