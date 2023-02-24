import { createElement, $, sortObjectArray } from './utils.js';

export default class Todo {
  LOCAL_STORAGE_KEY = 'tasks';

  constructor(targetContainer = $('ul'), form = $('form')) {
    this.tasks = this.getFromLocalStorage();
    this.targetContainer = targetContainer;
    this.dragState = { target: null, x: 0, y: 0, dragging: false };
    $('body').addEventListener('mousemove', (e) => this.moveTask(e));
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.editIndex = -1;
  }

  refresh() {
    this.tasks = this.getFromLocalStorage();
    this.render();
  }

  handleSubmit(event) {
    event.preventDefault();
    const { todo } = event.target;
    this.addTask(todo.value);
    event.target.reset();
  }

  addTask(task) {
    this.tasks.push({
      description: task,
      index: this.tasks.length + 1,
      completed: false,
    });
    this.saveToLocalStorage();
    this.render();
  }

  removeTask(index) {
    this.tasks = this.tasks.reduce((prev, curr) => {
      if (curr.index !== index) {
        curr.index = prev.length + 1;
        prev.push(curr);
      }
      return prev;
    }, []);
    this.saveToLocalStorage();
    this.closeEdit();
  }

  taskStateChange({ index, completed }) {
    this.tasks[index - 1].completed = !completed;
    this.saveToLocalStorage();
    this.closeEdit();
  }

  editTask({ index }) {
    if (this.dragState.dragging) return;
    this.editIndex = index;
    this.render();
  }

  closeEdit() {
    this.editIndex = -1;
    this.render();
  }

  updateTask(value) {
    if (this.tasks[this.editIndex - 1].description !== value) {
      this.tasks[this.editIndex - 1].description = value;
      this.saveToLocalStorage();
    }
    this.closeEdit();
  }

  moveTask({ x, y }) {
    if (!this.dragState.dragging) return;
    this.dragState.target.style.top = y - this.dragState.y + 'px';
    this.dragState.target.style.left = x - this.dragState.x + 'px';
  }

  reOrderTasks(item, index, steps, direction = 'down') {
    if (direction === 'up') {
      let position = index > steps ? index - steps : 1;
      for (let i = index; i > 1; i -= 1) {
        if (steps < 1) break;
        this.tasks[i - 2].index = i;
        steps -= 1;
      }
      this.tasks[index - 1].index = position;
    } else {
      let position =
        index + steps <= this.tasks.length ? index + steps : this.tasks.length;
      for (let i = index; i < this.tasks.length; i += 1) {
        if (steps < 1) break;
        this.tasks[i].index = i;
        steps -= 1;
      }
      this.tasks[index - 1].index = position;
    }
    this.tasks = sortObjectArray(this.tasks);
    this.saveToLocalStorage();
  }

  handleDrag({ x, y }, task, item, end = false) {
    if (!end) {
      if (!this.dragState.dragging) {
        this.dragState = { target: item, dragging: true, x, y };
        item.classList.add('dragging');
        item.onmouseup = (e) => this.handleDrag(e, task, item, true);
      }
    } else {
      if (this.dragState.dragging) {
        const distance = y - this.dragState.y;
        const steps = Math.floor(Math.abs(distance) / item.offsetHeight);
        if (Math.abs(distance) > item.offsetHeight) {
          if (distance < 0) this.reOrderTasks(item, task.index, steps, 'up');
          else this.reOrderTasks(item, task.index, steps);
        }
        this.dragState = { target: null, dragging: false, x: 0, y: 0 };
        console.log(item);
        item.classList.add('no-event');
        console.log(item.classList);
        setTimeout(() => {
          item.classList.remove('no-event');
        }, 1000);
        item.classList.remove('dragging');
      }
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(this.tasks));
  }

  getFromLocalStorage() {
    const cachedTasks = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return cachedTasks ? JSON.parse(cachedTasks) : [];
  }

  clearCompleted() {
    this.tasks = this.tasks.reduce((prev, curr) => {
      if (!curr.completed) {
        curr.index = prev.length + 1;
        prev.push(curr);
      }
      return prev;
    }, []);
    this.editIndex = -1;
    this.saveToLocalStorage();
    this.render();
  }

  isActive(task) {
    return this.editIndex === task.index;
  }

  render() {
    this.targetContainer.innerHTML = '';
    this.targetContainer.append(
      ...this.tasks.map((task) => {
        const item = createElement('li', {
          class: this.isActive(task) ? 'items active' : 'items',
        });
        item.addEventListener('focusout', () => {
          this.closeEdit();
        });
        const group = createElement('div', { class: 'task' });
        const p = createElement('p', {
          class: this.isActive(task) ? 'hidden' : '',
          textContent: task.description,
          style: task.completed
            ? 'color: var(--light); text-decoration: line-through'
            : '',
        });
        const input = createElement('input', {
          class: this.isActive(task) ? 'todoEdit' : 'hidden',
          value: task.description,
          autofocus: true,
          onchange: (e) => this.updateTask(e.target.value),
          onclick: (e) => {
            e.stopPropagation();
          },
        });
        item.addEventListener('click', () => {
          this.editTask(task);
        });
        const iconContainer = createElement('div', {
          class: 'icon',
          style: this.isActive(task) ? 'cursor:pointer' : '',
          onclick: (e) => {
            e.stopPropagation();
            if (this.isActive(task)) this.removeTask(task.index);
          },
          onmousedown: (e) => {
            !this.isActive(task) && this.handleDrag(e, task, item);
          },
        });
        const icon = createElement('i', {
          class: `fa fa-${this.isActive(task) ? 'trash' : 'ellipsis-vertical'}`,
        });
        const checkIcon = createElement('div', {
          class: 'icon',
          style: `color:var(${task.completed ? '--blue' : '--light'})`,
          innerHTML: `<i class="fa fa-${
            task.completed ? 'check' : 'square far'
          }"></i>`,
          onclick: (e) => {
            e.stopPropagation();
            this.taskStateChange(task);
          },
        });
        iconContainer.appendChild(icon);
        group.append(checkIcon, input, p);
        item.append(group, iconContainer);
        return item;
      })
    );
  }
}
