export default class TaskManager {
    constructor() {
        this.arr = {
            'todo': [1],
            'inProgress': [],
            'done': [],
        }
    }
    
    save(task, key) {
        if(!this.arr[key].includes(task)) {
            this.arr[key].push(task);
        }
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

