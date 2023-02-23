import '@fortawesome/fontawesome-free/js/all.js';
import '@fortawesome/fontawesome-free/css/all.css';

import './style.css';
import Todo from './modules/todo.js';
import { $, createElement } from './modules/utils.js';

function init() {
  const form = createElement('form', {
    innerHTML: `<input
        type="text" required name="todo" id="todo"
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

  const todos = new Todo(list, form);
  todos.render();
  button.onclick = () => todos.clearCompleted();
  $('#refresh').onclick = () => todos.refresh();
  return [form, list, button];
}

document.getElementById('root').append(...init());
