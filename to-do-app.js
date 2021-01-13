import "./to-do-item.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host {
            display: block;
            font-family: sans-serif;
            text-align: center;
        }
        button {
            background-color: white; 
            color: black; 
            border: 1px solid #4CAF50;
        }
        ul {
            list-style: none;
            padding: 0;
            text-align: left;
        }
        .container {
          display: flex;
          justify-content: center;
        }
    </style>
    <h3>Jan 2020</h3>
    <h2>To do</h2>
    <form id="todo-input">
        <input type="text" placeholder="Add item"></input>
        <button>Add ✔️</button>
    </form>
    <div class="container">
      <ul id="todos"></ul>
    </div>
`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$todoList = this._shadowRoot.querySelector("ul");
    this.$input = this._shadowRoot.querySelector("input");

    this.$submitButton = this._shadowRoot.querySelector("button");
    this.$submitButton.addEventListener("click", this._addTodo.bind(this));

    this.todos = [
      { text: "Buy Groceries", checked: false },
      { text: "Electricity Bill", checked: true },
      { text: "Organise the Shelf", checked: false }
    ];
  }

  _removeTodo(e) {
    this._todos.splice(e.detail, 1);
    this._renderTodoList();
  }

  _toggleTodo(e) {
    const todo = this._todos[e.detail];
    this._todos[e.detail] = Object.assign({}, todo, {
      checked: !todo.checked
    });
    this._renderTodoList();
  }

  _addTodo(e) {
    e.preventDefault();
    if (this.$input.value.length > 0) {
      this._todos.push({ text: this.$input.value, checked: false });
      this._renderTodoList();
      this.$input.value = "";
    }
  }

  _renderTodoList() {
    this.$todoList.innerHTML = "";

    this._todos.forEach((todo, index) => {
      let $todoItem = document.createElement("to-do-item");
      $todoItem.setAttribute("text", todo.text);

      if (todo.checked) {
        $todoItem.setAttribute("checked", "");
      }

      $todoItem.setAttribute("index", index);

      $todoItem.addEventListener("onRemove", this._removeTodo.bind(this));
      $todoItem.addEventListener("onToggle", this._toggleTodo.bind(this));

      this.$todoList.appendChild($todoItem);
    });
  }

  set todos(value) {
    this._todos = value;
    this._renderTodoList();
  }

  get todos() {
    return this._todos;
  }
}

window.customElements.define("to-do-app", TodoApp);
