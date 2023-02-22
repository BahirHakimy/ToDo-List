import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/all.css';

import './style.css';
import { createElement } from './modules/utils.js';
import Todo from './modules/todo.js';

function init() {
  const tasks = [
    { description: 'Wash the car', completed: false, index: 0 },
    { description: 'Goto to grocery store', completed: true, index: 1 },
    { description: 'Fix the tv', completed: false, index: 3 },
  ];

  const form = createElement('form', {
    innerHTML: `<input
      type="text" name="todo" id="todo"
      placeholder="Add to your list..." />
      <button id="submit">
        <div class="icon">
          <i class="fa fa-arrow-right"></i>
        </div>
      </button>`,
  });

  const list = createElement('ul', { id: 'list' });
  const button = createElement('button', {
    id: 'clear',
    textContent: 'Clear all completed',
  });
  const todos = new Todo(tasks, list);
  todos.render();

  return [form, list, button];
}

document.getElementById('root').append(...init());
