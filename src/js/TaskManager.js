export default class TaskManager {
    constructor() {
        this.arr = {
            'todo': [],
            'inProgress': [],
            'done': [],
        }
        this.btn = `
            <button class="openInput">🞢 Add another card</button>
        `;
        this.form = `
            <form class = "taskForm">
                <textarea class = "taskText" placeholder = "Создайте заметку..." required></textarea>
                <div class = "controlInput">
                    <div>
                        <button class="addCard">Add card</button>
                        <button class="closeInput">🗙</button>
                    </div>
                    <div class="file-container">
                        <input class="fileInput" type="file" accept="image/*">
                        <span class="overlap">···</span>
                    </div>
                </div>
            </form>
                
        `;
        this.mouseDown = this.mouseDown.bind(this)
        this.move = this.move.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.showPlace = this.showPlace.bind(this);
        this.loadStorage = this.loadStorage.bind(this);
        this.control = this.control.bind(this);
    }

    loadStorage() {
        const previouslySaved = localStorage.getItem("arr");
    
        if (previouslySaved !== null) {
          this.arr = JSON.parse(previouslySaved);
        }
    }

    saveInArr(task, key) {
        for (let i in this.arr) {
            if(this.arr[i].includes(task)) {
                return
            }
        }
        this.arr[key].push(task);
        localStorage.setItem("arr", JSON.stringify(this.arr));
    }

    removeFromArr(task, key) {
        const elm = task.querySelector('p').textContent;
        const indexElm = this.arr[`${key}`].indexOf(elm);
        this.arr[`${key}`].splice(indexElm, 1)
    }

    control(e) {
        if(e.target.className == 'openInput') {
            this.openInput(e);
        }
        if(e.target.className == 'closeInput') {
            this.closeInput(e);
        }
        if(e.target.className == 'delete') {
            this.delete(e);
        }
        if(e.target.className == 'addCard') {
            this.add(e);
        }
        
    }

    addListeners() {
        let tasks = document.querySelectorAll('.task')
        tasks.forEach(i => i.addEventListener('mousedown', this.mouseDown));
    }

    add(e) {
        e.preventDefault();
        if(document.querySelector('.taskText').value.trim()) {
            const fileInput = document.querySelector('.fileInput');
            const file = fileInput.files && fileInput.files[0];

            this.saveInArr(document.querySelector('.taskText').value, e.target.parentElement.parentElement.parentElement.parentElement.className)
            this.render();
            e.target.parentElement.parentElement.parentElement.parentElement.insertAdjacentHTML('beforeEnd', this.btn)
            e.target.parentElement.parentElement.parentElement.remove()

            if(file) {
                document.querySelector('.task').insertAdjacentHTML('afterbegin', `
                    <img class="taskImg" src="">
                `)
                const taskImg = document.querySelector('.taskImg');
                const img = (e) => {
                    taskImg.src = e.target.result;
                }
                const reader = new FileReader();
                reader.addEventListener('load', img)
                reader.readAsDataURL(file)
            }
        }
    }
    
    delete(e) {
        e.preventDefault();
        this.removeFromArr(e.target.parentElement, e.target.parentElement.parentElement.parentElement.className)
        localStorage.setItem("arr", JSON.stringify(this.arr));
        this.render();
    }

    closeInput(e) {
        e.preventDefault();
        document.querySelectorAll('.taskForm').forEach(i => {
            i.parentElement.insertAdjacentHTML('beforeEnd', this.btn)
            i.remove();
        })
    }

    openInput(e) {
        if(document.querySelector('.taskForm')) {
            this.closeInput(e);
        }
        e.target.parentElement.insertAdjacentHTML('beforeEnd', this.form)
        e.target.remove();
    }

    mouseDown(e) {
        if(e.target.closest('.task') && !e.target.closest('.delete')) {
            this.draggedEl = e.currentTarget;
            this.ghostEl = e.currentTarget.cloneNode(true);
            this.ghostEl.classList.add('dragged');
            this.ghostEl.classList.add('ghost');
            this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
            this.ghostEl.style.height = `${this.draggedEl.offsetHeight}px`;
            document.body.appendChild(this.ghostEl);

            const { top, left } = e.target.getBoundingClientRect();
            this.top = e.pageY - top;
            this.left = e.pageX - left;

            this.ghostEl.style.top = `${e.pageY  - this.draggedEl.offsetHeight}px`;
            this.ghostEl.style.left = `${e.pageX - this.draggedEl.offsetWidth}px`;

            this.ghostEl.style.width = `${this.draggedEl.offsetWidth}px`;
            this.ghostEl.style.height = `${this.draggedEl.offsetHeight}px`;

            this.draggedEl.style.display = 'none';
            this.ghostEl.addEventListener('mousemove', this.move);
            document.addEventListener('mousemove', this.showPlace);
            document.addEventListener('mouseup', this.mouseUp);
            
        }
    }

    mouseUp() {
        if (!this.draggedEl) {
            return;
        }

        this.removeFromArr(this.draggedEl, this.draggedEl.parentElement.parentElement.className)

        this.newPlace.replaceWith(this.draggedEl);

        this.saveInArr(this.draggedEl.querySelector('p').textContent, this.draggedEl.parentElement.parentElement.className)

        this.draggedEl.style.display = 'flex';
        document.body.removeChild(document.body.querySelector(".dragged"));
      
        this.ghostEl = null;
        this.draggedEl = null;
    }

    move(e) {
        e.preventDefault();
        if (!this.draggedEl) {
          return;
        }
        this.ghostEl.style.top = `${e.pageY - this.top}px`;
        this.ghostEl.style.left = `${e.pageX - this.left}px`;
    }

    showPlace(e) {
        e.preventDefault();
        if (!this.draggedEl) {
          return;
        }
        const columnTask = document.elementsFromPoint(e.pageX, e.pageY)
        columnTask.forEach(i => {
            if(i.id == 'taskList') {
                const tasks = i.querySelector('.tasks')
                const allTasks = tasks.querySelectorAll('.task');
                const allPos = [tasks.getBoundingClientRect().top];
                if (allTasks) {
                    for (const item of allTasks) {
                        allPos.push(item.getBoundingClientRect().top + item.offsetHeight / 2);
                    }
                }
                
                if (!this.newPlace) {
                    this.newPlace = document.createElement('li');
                    this.newPlace.classList.add('new-place');
                }
            
                this.newPlace.style.width = `${this.ghostEl.offsetWidth}px`;
                this.newPlace.style.height = `${this.ghostEl.offsetHeight}px`;
                
                const itemIndex = allPos.findIndex((item) => item > e.pageY);
                if (itemIndex !== -1) {
                    tasks.insertBefore(this.newPlace, allTasks[itemIndex - 1]);
                } else {
                    tasks.appendChild(this.newPlace);
                }
                  
            }
        })
    }

    render() {
        this.loadStorage();
        if(document.querySelector('.task')) {
            document.querySelectorAll('.task').forEach(i => i.remove())
        }
        for(let key in this.arr) {
            this.arr[key].forEach(i => {
                document.querySelector(`.${key} .tasks`).insertAdjacentHTML('afterbegin', `
                    <li class="task">
                        <button class="delete">🗙</button>
                        <p>${i}</p>
                    </li>
                `)
            });
        }
        document.addEventListener('click', this.control);
        this.addListeners();
    }
}

