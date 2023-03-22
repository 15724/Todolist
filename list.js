let todos = [];
const STOGRAGE_KEY = 'todos'
const input = document.querySelector('.input_todo');
const button = document.querySelectorAll('button');


const btn_add = document.querySelector('.todo_add');
const btn_complete = document.querySelector('.todo_complete');
const btn_incomplete = document.querySelector('.todo_incomplete');
const btn_todo_all = document.querySelector('.todo_all');


function addTodo(newTodo) {    //새 할일 추가 함수

    const ol = document.querySelector('.list')
    const li = document.createElement('li');         //클릭할 때 마다 li태그 생성
    const btn_content = document.createElement('button');
    const btn_delete = document.createElement('button');

    li.classList.add('todo-row')                 // li태그 가로로 나열하는 클래스명 추가
    btn_content.classList.add('todo_content')    // 할일 내용 버튼 클래스명 추가
    btn_delete.classList.add('todo_delete')      // 삭제버튼 클래스명 추가

    ol.appendChild(li)
    li.appendChild(btn_content)                              //기존에 있던 ul태그에 입력한 할 일 추가
    li.appendChild(btn_delete)

    btn_content.innerText = newTodo;                //li자리에 입력 값 추가

    btn_delete.addEventListener('click', deleteTodo);
    btn_content.addEventListener('click', completeTodo);

    saveTodo();


}



const form = document.querySelector('.form');
function todoSubmit(event) {
    event.preventDefault();
    const newTodo = input.value;
    input.value = "";                  //입력 텍스트 초기화

    if (newTodo.trim() !== "" && newTodo !== null) {
        addTodo(newTodo)

        todos.push({
            todo: newTodo,  //newTodo라하면 포인터가 나옴.. 
            complete: false
        })  // todos배열에 추가
    }
    saveTodo();
}


function loadTodoComplete() {  //완료 버튼 누르면 미완료 부분은 삭제
    btn_incompleted_clicked = false;
    showTodo = [];
    const incompleted = document.querySelectorAll('li:not(.complete)'); //미완료한 할일들 
    incompleted.forEach(el => {
        showTodo.push(el.innerText);
        el.remove();
    })
    // 여기서 하면 complete 버튼 눌렀다가 전체 누르면 안나옴 showTodo = [];

}

//submit는 엔터나 버튼 클릭 시 발생
form.addEventListener('submit', todoSubmit)

//새로고침하면 todos배열이 빈 배열로 변경되므로 로컬 스토리지에서 parse한 배열로 업데이트한다. 
const savedTodos = localStorage.getItem(STOGRAGE_KEY)
if (savedTodos !== null) {
    const parsedTodos = JSON.parse(savedTodos);
    todos = parsedTodos;
    parsedTodos.forEach(e => addTodo(e.todo))  //새로고침해도 기존에 추가한 할 일들 화면에 띄우기
}

todos.forEach((e, i) => {
    if (e.complete) {  //완료한 할 일이 있으면 클래스 속성 추가해 완료된 스타일로 적용
        document.querySelectorAll('.todo-row')[i].classList.add('complete');
    }
})



function saveTodo() {
    localStorage.setItem(STOGRAGE_KEY, JSON.stringify(todos)); //todos배열 값을 저장소에 넣음

}

let showTodo = [];
let btn_incompleted_clicked = false;

function loadTodoInComplete() {  //미완료 버튼 누르면 완료된 리스트 삭제 
    //const completed = document.getElementsByClassName('complete');
    //completed.parentNode.removeChild(completed);
    btn_incompleted_clicked = true;
    showTodo = [];
    document.querySelectorAll('.complete').forEach(el => {
        showTodo.push(el.innerText);   // 완료된 할 일들을 빈 배열에 추가
        el.remove();
    });

    console.log(showTodo);

}





function completeTodo(e) {   // 할일 완료 함수
    const completed = e.target;
    completed.parentNode.classList.toggle('complete');   //완료된 리스트 목록 클래스 명으로 구분
    //const btn_check = e.target.nextSibling;         //버튼이 체크로 변할 부분


    if (completed.parentNode.classList.contains('complete')) {      // 완료된 할일은 complete속성을 참으로 변경
        let completeIndex = todos.findIndex(x => x.todo === completed.outerText);     //할일 완료한 텍스트 배열 인덱스 찾기
        todos[completeIndex].complete = true;
        saveTodo();  //complete속성이 true로 바뀌는 것을 저장
    }

}


function deleteTodo(e) {

    const todo = e.target.previousSibling;   //삭제 버튼 앞에 있는 텍스트 버튼 태그부분
    const deleteButton = e.target;
    const todo_text = todo.outerText;        //삭제 버튼 앞에 있는 추가했었던 할일 텍스트
    const index = todos.findIndex(x => x.todo === todo_text);   // 삭제할 인덱스 찾기(todo를 클릭한 텍스트인)
    todos.splice(index, 1);          //todos배열에서 할일 삭제 
    const removeTodo = e.target.parentNode;
    removeTodo.remove();    // 할일 완료한 li태그 삭제
    const key = removeTodo.childNodes[0].innerHTML;
    localStorage.removeItem(key);
    saveTodo();   // 그 배열을 로컬 저장소에 저장!
}





function loadTodoAll() {
    const remainTodoCount = document.querySelectorAll('.todo-row').length; //삭제가 된 다음 개수를 세야함. 
    //todos.forEach(e => todoAll.push(e.todo))

    if (todos.length > remainTodoCount) {   // 할 일 일부를 더 추가해야 한다면
        // console.log(`${lists.length}`);
        // lists.forEach(e => showTodo.push(e.innerText))    // 사이트에 보이는 할일들 추가
        // console.log(todoAll, showTodo)
        // //전체 할일 중에서 포함된게 없으면 추가하기

        showTodo.forEach(e => {
            // let idx = todos.findIndex(e => e.complete === true)

            addTodo(e);

            //만약에 미완료 버튼 누른 다음 전체 버튼 누른거면 완료된 부분은 showtTodo에 다 있으므로 클래스 속성 추가해줌.  
            if (btn_incompleted_clicked) {
                Array.from(document.querySelectorAll('.todo-row')).slice(remainTodoCount).forEach(e => e.classList.add('complete'));
            }
            //document.querySelectorAll('.todo-row')[0].parentNode.insertBefore(document.querySelectorAll('.todo-row')[2], document.querySelectorAll('.todo-row')[0])


            //console.log(todos.findIndex(e => e.complete === true))
        })

    }
}


btn_complete.addEventListener('click', loadTodoComplete);
btn_incomplete.addEventListener('click', loadTodoInComplete);
btn_todo_all.addEventListener('click', loadTodoAll);






