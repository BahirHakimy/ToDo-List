import Todo from '../modules/todo';

const init = () => {
  const target = document.createElement('ul');
  document.body.insertAdjacentHTML(
    'afterbegin',
    '<form><button type="submit"></button></form>'
  );
  document.body.appendChild(target);
  const todo = new Todo(target);
  return todo;
};

// beforeEach = () => {
//   document.body.innerHTML = '';
// };

describe('Todo Add Functionality', () => {
  const todo = init();

  beforeEach(() => {
    todo.tasks = [];
  });

  test('addTask works correctly and todo is added to tasks array', () => {
    todo.addTask('Task1');
    expect(todo.tasks.length).toBe(1);
  });

  test('Added task should have the correct content and the right index', () => {
    const taskTitle = 'Task 2';
    todo.addTask(taskTitle);
    expect(todo.tasks.length).toBe(1);
    expect(todo.tasks[0].description).toBe(taskTitle);
    expect(todo.tasks[0].index).toBe(1);
  });

  test('Added task should be saved to local storage', () => {
    const taskTitle = 'Task storage';
    todo.addTask(taskTitle);
    expect(localStorage.getItem(todo.LOCAL_STORAGE_KEY)).toBeDefined();
    expect(JSON.parse(localStorage.getItem(todo.LOCAL_STORAGE_KEY))).toEqual(
      todo.tasks
    );
  });

  test('The right li is rendered to the dom', () => {
    const taskTitle = 'Task 1 list item';
    todo.addTask(taskTitle);
    expect(document.querySelector('li').innerHTML).toContain(taskTitle);
    expect(document.querySelector('ul').children.length).toBe(1);
  });
});

describe('Todo Remove Functionality', () => {
  test('test', () => {});
});
