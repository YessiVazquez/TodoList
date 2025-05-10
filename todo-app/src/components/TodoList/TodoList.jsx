// src/components/TodoList/TodoList.jsx
import { TodoFilters } from "../TodoFilters";
import { Todo } from "../Todo"; 


// src/components/TodoList/TodoList.jsx
const  TodoList = ({ 
  todos, 
  handleSetComplete, 
  handleClearComplete,
  handleDelete, 
  activeFilter, 
  showAllTodos, 
  showActiveTodos, 
  showCompletedTodos,
  categories 
}) => {

  console.log("TodoList Rendered");
  return (
    <div className="flex flex-col mt-7 rounded-lg overflow-hidden shadow-2xl">
      {todos.map(todo => {
        return(
          <Todo 
            key={todo.id} 
            todo={todo} 
            handleDelete={handleDelete}
            handleSetComplete={handleSetComplete}
            categories={categories}
          />
        );
      })}
      <TodoFilters 
        activeFilter = {activeFilter}
        total={todos.length}
        showAllTodos={showAllTodos}
        showActiveTodos={showActiveTodos}
        showCompletedTodos={showCompletedTodos}
        handleClearComplete={handleClearComplete}
      />
    </div>
  );
};

export { TodoList }; 
