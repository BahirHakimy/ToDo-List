import Todo from '../modules/todo.js';

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

const todo = init();

describe('Todo Add Functionality', () => {
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
  beforeEach(() => {
    todo.tasks = [];
  });

  test('removeTask works correctly and the task is removed from the tasks array', () => {
    todo.addTask('Task1');
    const task = todo.tasks[0];
    expect(todo.tasks.length).toBe(1);
    todo.removeTask(task.index);
    expect(todo.tasks.length).toBe(0);
  });

  test('Removed task should be removed from local storage', () => {
    const taskTitle = 'Task storage';
    todo.addTask(taskTitle);
    const task = todo.tasks[0];
    expect(localStorage.getItem(todo.LOCAL_STORAGE_KEY)).toBeDefined();
    expect(JSON.parse(localStorage.getItem(todo.LOCAL_STORAGE_KEY))).toEqual(
      todo.tasks
    );
    todo.removeTask(task.index);
    expect(JSON.parse(localStorage.getItem(todo.LOCAL_STORAGE_KEY))).toEqual(
      []
    );
  });

  test('The right li is removed from the dom', () => {
    const taskTitle = 'Task 1 list item';
    todo.addTask(taskTitle);
    const task = todo.tasks[0];
    expect(document.querySelector('li').innerHTML).toContain(taskTitle);
    expect(document.querySelector('ul').children.length).toBe(1);
    todo.removeTask(task.index);
    expect(document.querySelector('ul').children.length).toBe(0);
  });
});

describe('Todo Edit Functionality', () => {
  beforeEach(() => {
    todo.tasks = [];
  });

  test('updateTask works correctly and todo content should be the updated content', () => {
    const originalTask = 'Task before update';
    const updatedTask = 'Task after update';
    todo.addTask(originalTask);
    const task = todo.tasks[0];
    expect(task.description).toBe(originalTask);
    todo.editIndex = task.index;
    todo.updateTask(updatedTask);
    expect(task.description).toBe(updatedTask);
  });

  test('The li with the updated content should be rendered', () => {
    const originalTask = 'Task content before update';
    const updatedTask = 'Task content after update';
    todo.addTask(originalTask);
    expect(document.querySelector('li p').innerHTML).toContain(originalTask);
    const task = todo.tasks[0];
    todo.editIndex = task.index;
    todo.updateTask(updatedTask);
    expect(document.querySelector('li p').innerHTML).toContain(updatedTask);
  });
});

describe('Todo Update Items Completed Functionality', () => {
  beforeEach(() => {
    todo.tasks = [];
  });

  test('Update state works correctly and the task state is updated', () => {
    const task1 = 'Task incomplete';
    todo.addTask(task1);
    const task = todo.tasks[0];
    expect(task.completed).toBeFalsy();
    todo.taskStateChange(task);
    expect(task.completed).toBeTruthy();
  });

  test('Update state of the task is rendered correctly in the DOM', () => {
    const task1 = 'Task incomplete';
    todo.addTask(task1);
    const task = todo.tasks[0];
    expect(document.querySelector('li i').classList).toContain('fa-square');
    todo.taskStateChange(task);
    expect(document.querySelector('li i').classList).toContain('fa-check');
    expect(document.querySelector('li p').style.textDecoration).toBe(
      'line-through'
    );
  });
});

describe('Todo clear completed Items Functionality', () => {
  beforeEach(() => {
    todo.tasks = [];
  });

  test('Clear all completed tasks should remove all completed tasks from the tasks array', () => {
    const task1 = 'Task 1 complete';
    const task2 = 'Task 2 undone task';
    const task3 = 'Task 3 complete';
    todo.addTask(task1);
    todo.addTask(task2);
    todo.addTask(task3);

    todo.tasks.forEach((element) => {
      if (element.description.match(/complete/)) {
        todo.taskStateChange(element);
      }
    });
    expect(todo.tasks.length).toBe(3);
    todo.clearCompleted();

    todo.tasks.forEach((element) => {
      expect(element.completed).toBeFalsy();
    });
    expect(todo.tasks.length).toBe(1);
  });

  test('Clear all completed tasks should remove all completed tasks from the DOM', () => {
    const task1 = 'Task 1 complete';
    const task2 = 'Task 2 undone task';
    const task3 = 'Task 3 complete';
    todo.addTask(task1);
    todo.addTask(task2);
    todo.addTask(task3);

    todo.tasks.forEach((element) => {
      if (element.description.match(/complete/)) {
        todo.taskStateChange(element);
      }
    });
    expect(document.querySelector('ul').children.length).toBe(3);
    todo.clearCompleted();

    Array.from(document.querySelector('ul').children).forEach((element) => {
      expect(element.querySelector('i').classList).toContain('fa-square');
      expect(element.querySelector('p').style.textDecoration).not.toBe(
        'line-through'
      );
    });
    expect(todo.tasks.length).toBe(1);
  });
});
