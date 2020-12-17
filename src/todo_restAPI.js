// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// define variables and functions used
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const displayTodoItemsCount = function() {
	let count = todos.length || 0;
	nodes.totalItemsCount.innerHTML = count;
}

const addTodo = function() {
	// get the input text and make new todo object:
	const todoText = nodes.addTodoInput.value;
	const newTodo = {
		"title": todoText,
		"completed": false
	};
	// console.log('new todo: ',newTodo);
	
	// post the new todo:
	fetch(todosAPIroot,{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newTodo)
	}).then(response=>{
		if(response.status === 201){
			// sync and render todos:
			todos = [...todos, newTodo];
			renderTodos();
		}
	})
	
	// update todos count:
	displayTodoItemsCount();
	
	// clear input text
	nodes.addTodoInput.value = '';
	
	// focus on input for new todo:
	nodes.addTodoInput.focus();
}
const removeTodo = function (e) {
	// get id of todo to be removed:
	let todoID;
	if(e.target.classList.contains('fa-trash-alt')){
		todoID = e.target.parentNode.parentNode.dataset.id;
	}else if( e.target.classList.contains('removeTodo')){
		todoID = e.target.parentNode.dataset.id;
	}
	
	// remove todo:
	fetch(`${todosAPIroot}/${todoID}`,{
		method: 'DELETE'
	})
	.then(response=>{
		console.log(response);
		if(response.status === 200){
			todos.splice(todoID, 1)
		}
	})
}

class updateHTTP { 
	
	// Make an HTTP PUT Request 
	async put(url, data) { 
		
		// Awaiting fetch which contains method, 
		// headers and content-type and body 
		const response = await fetch(url, { 
			method: 'PUT', 
			headers: { 
				'Content-type': 'application/json'
			}, 
			body: JSON.stringify(data) 
		}); 
		
		// Awaiting response.json() 
		const resData = await response.json(); 
		
		// Return response data  
		return resData; 
	} 
}

const completeTodo = function () {
	const checkBox = document.querySelectorAll('.checkbox')
	const update = new updateHTTP;
	
	for(let i = 0; i < checkBox.length; i++) {
		if (checkBox[i].checked){
			fetch(`${todosAPIroot}/${i + 1}`).then(r => r.json()).then(data => {
				update.put(`${todosAPIroot}/${i + 1}`, {
					"title": data.title,
					"completed": data.completed ? false : true
				})
			})
		}
	}
}


const renderTodos = function(e) {
	// clean current todos:
	nodes.todoListUL.innerHTML = '';
	
	todos.forEach( todo => {
		const li = document.createElement('li');
		
		li.innerHTML = `
		<input type="checkbox" class="checkbox" onclick="completeTodo()">
		<span class="todoID">${todo.id}.</span>
		<span ${todo.completed? 'class="completed"' : ''}>${todo.title}</span>
		<div class="removeTodo"><i class="far fa-trash-alt"></i></div>
		<div class="editTodo"><i class="fas fa-pencil-alt"></i></div>
		`;
		
		li.setAttribute("data-id", todo.id);
		nodes.todoListUL.appendChild(li);
	});
	
	displayTodoItemsCount();
}


let nodes = {
	'todoListUL': document.querySelector('ul.todoListItems'),
	'addTodoInput': document.querySelector('.addTodo>input'),
	'addTodoBtn': document.querySelector('.addTodo>.btnAdd'),
	'totalItemsCount': document.querySelector('.todoApp .total>.output'),
	'checkBoxe' : document.querySelector('input.checkbox')
}

let todosAPIroot = 'http://localhost:3000/todos';

// todos array of todo objects:
let todos = [];
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// attach events
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.addEventListener('DOMContentLoaded', event=>{
	fetch(todosAPIroot)
	.then(response=>response.json())
	.then(data => {
		// sync and render todos:
		todos = [...data];
		// console.log(todos);
		renderTodos();
	});
});

// add Todo Item (on button click or on enter pressed):
nodes.addTodoBtn.addEventListener('click', addTodo);
nodes.addTodoInput.addEventListener('keyup', function(e) {
	if(e.keyCode === 13){
		addTodo();
	}
})
// remove Todo Item:
window.addEventListener('click', e => {
	if(e.target.className === 'far fa-trash-alt') {
		removeTodo(e)
	}
})
// complete Todo: HW
