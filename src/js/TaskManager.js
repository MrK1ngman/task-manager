export default class TaskManager {
    constructor() {
        this.arr = {
            'todo': [`ssssssssssssssssssssssssssssssssssss`],
            'inProgress': [1, 2, 3],
            'done': [5],
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
    }
    
    save(task, key) {
        if(!this.arr[key].includes(task)) {
            this.arr[key].push(task);
        }
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

    add(e) {
        e.preventDefault();
        if(document.querySelector('.taskText').value.trim()) {
            const fileInput = document.querySelector('.fileInput');
            const file = fileInput.files && fileInput.files[0];

            this.save(document.querySelector('.taskText').value, e.target.parentElement.parentElement.parentElement.parentElement.className)
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
        const elm = e.target.parentElement.querySelector('p').textContent;
        const arrName = e.target.parentElement.parentElement.className;
        const indexElm = this.arr[`${arrName}`].indexOf(elm);
        this.arr[`${arrName}`].splice(indexElm, 1)
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

    move(e) {

    }

    render() {
        if(document.querySelector('.task')) {
            document.querySelectorAll('.task').forEach(i => i.remove())
        }
        for(let key in this.arr) {
            this.arr[key].forEach(i => {
                document.querySelector(`.${key} h4`).insertAdjacentHTML('afterend', `
                    <li class="task">
                        <button class="delete">🗙</button>
                        <p>${i}</p>
                    </li>
                `)
            });
            
        }
    }
}

