import { createElement, $ } from './utils.js';

export default class Todo {
  LOCAL_STORAGE_KEY = 'tasks';

  constructor(targetContainer = $('ul'), form = $('form')) {
    this.tasks = this.getFromLocalStorage();
    this.targetContainer = targetContainer;
    form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.editIndex = -1;
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
      index: this.tasks.length,
      completed: false,
    });
    this.saveToLocalStorage();
    this.render();
  }

  removeTask(index) {
    this.tasks = this.tasks.reduce((prev, curr) => {
      if (curr.index !== index) {
        curr.index = prev.length;
        prev.push(curr);
      }
      return prev;
    }, []);
    this.saveToLocalStorage();
    this.closeEdit();
  }

  taskStateChange({ index, completed }) {
    this.tasks[index].completed = !completed;
    this.saveToLocalStorage();
    this.closeEdit();
  }

  editTask({ index }) {
    this.editIndex = index;
    this.render();
  }

  closeEdit() {
    this.editIndex = -1;
    this.render();
  }

  updateTask(value) {
    if (this.tasks[this.editIndex].description !== value) {
      this.tasks[this.editIndex].description = value;
      this.saveToLocalStorage();
    }
    this.closeEdit();
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
        curr.index = prev.length;
        prev.push(curr);
      }
      return prev;
    }, []);
    this.editIndex = -1;
    this.saveToLocalStorage();
    this.render();
  }

  render() {
    this.targetContainer.innerHTML = '';
    this.targetContainer.append(
      ...this.tasks.map((task) => {
        const item = createElement('li', {
          onclick: () => this.editTask(task),
          class: this.editIndex === task.index ? 'active' : '',
        });
        const group = createElement('div', { class: 'task' });
        const p = createElement('p', {
          class: this.editIndex === task.index ? 'hidden' : '',
          textContent: task.description,
          style: task.completed
            ? 'color: var(--light); text-decoration: line-through'
            : '',
        });
        const input = createElement('input', {
          class: this.editIndex === task.index ? 'todoEdit' : 'hidden',
          defaultValue: task.description,
          autofocus: true,
          onchange: (e) => this.updateTask(e.target.value),
          onclick: (e) => e.stopPropagation(),
        });
        const iconContainer = createElement('div', {
          class: 'icon',
          style: this.editIndex === task.index ? 'cursor:pointer' : '',
          onclick: (e) => {
            e.stopPropagation();
            if (this.editIndex === task.index) this.removeTask(task.index);
          },
        });
        const icon = createElement('i', {
          class: `fa fa-${
            this.editIndex === task.index ? 'trash' : 'ellipsis-vertical'
          }`,
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
      }),
    );
  }
}
