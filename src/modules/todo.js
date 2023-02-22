import { createElement, $ } from './utils.js';

export default class Todo {
  constructor(tasks = [], targetContainer = $('ul')) {
    this.tasks = tasks;
    this.targetContainer = targetContainer;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  render() {
    this.targetContainer.append(
      ...this.tasks.map((task) => {
        const item = createElement('li');
        const group = createElement('div', { class: 'task' });
        const check = createElement('input', {
          type: 'checkbox',
          checked: task.completed,
        });
        const p = createElement('p', {
          textContent: task.description,
          style: task.completed
            ? 'color: var(--light); text-decoration: line-through'
            : '',
        });
        const iconContainer = createElement('div', { class: 'icon' });
        const icon = createElement('i', { class: 'fa fa-ellipsis-vertical' });
        const checkIcon = createElement('div', {
          class: 'icon',
          style: 'color:var(--blue)',
          innerHTML: '<i class="fa fa-check"></i>',
        });
        iconContainer.appendChild(icon);
        group.append(task.completed ? checkIcon : check, p);
        item.append(group, iconContainer);
        return item;
      }),
    );
  }
}
