(function() {

    //создаем и возвращаем заголовок приложения 
    function createAppTitel(titel) {
        
        let appTitel = document.createElement('h2');
        appTitel.innerHTML = titel;

        return appTitel;

    };
    
    //создаем и возвращаем форму для создания дела
    function createToDoItemForm() {

        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'md-3');
        input.classList.add('form-control');
        input.placeholder = 'Название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btm', 'btm-primary');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return { form, input, button };

    };

    //создаем и возвращаем список элементов 
    function createToDoList() {
        
        let list = document.createElement('ul');
        list.classList.add('list-group');

        return list;

    };

    function createToDoItemElement(todoItem, { onDone, onDelete }) {

        const doneClass = 'list-group-item-success';

        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        if (todoItem.done) {

            item.classList.add(doneClass);

        }

        item.textContent = todoItem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        doneButton.addEventListener('click', function () {

            onDone({ todoItem, element: item });
            item.classList.toggle(doneClass, todoItem.done);

        });

        deleteButton.addEventListener('click', function () {
            
            onDelete({ todoItem, element: item });

        });

        return item;

    };

    async function createToDoApp(container, titel, owner) {
    
        let todoAppTitel = createAppTitel(titel);
        let todoItemForm = createToDoItemForm();
        let todoList = createToDoList();

        const hendlers = {

            onDone({ todoItem }) {

                todoItem.done = !todoItem.done; 
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {

                    method: 'PATCH',
                    body: JSON.stringify({ done: todoItem.done }),
                    headers: {

                        'Content-Type': 'application/json',
    
                    }

                });

            },
            onDelete({ todoItem, element }) {

                if (!confirm('Вы уверены?')) {

                    return;

                }

                element.remove();
                fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {

                    method: 'DELETE',

                });

            },

        };

        container.append(todoAppTitel);
        container.append(todoItemForm.form);
        container.append(todoList);

        const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
        const todoItemList = await response.json();

        todoItemList.forEach(todoItem => {
            
            const todoItemElement = createToDoItemElement(todoItem, hendlers);
            todoList.append(todoItemElement);

        });

        todoItemForm.form.addEventListener('submit', async function (e) {
            
            e.preventDefault();

            if (!todoItemForm.input.value) {

                return;

            }

            const respone = await fetch('http://localhost:3000/api/todos' , {

                method: 'POST',
                body: JSON.stringify({

                    name: todoItemForm.input.value.trim(),
                    owner,

                }),
                headers: {

                    'Content-Type': 'application/json', 

                }

            });
            const todoItem = await respone.json(); 

            const todoItemElement = createToDoItemElement(todoItem, hendlers);

            todoList.append(todoItemElement);
            todoItemForm.input.value = '';

        });

    };

    window.createToDoApp = createToDoApp;

})();