// src/components/Todo.jsx
const Todo = ({ todo, handleSetComplete, handleDelete, categories }) => {
  const { id, title, completed, category_id } = todo;

  const category = categories.find(cat => String(cat.id) === String(category_id));

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-solid border-gray-600">
      <div className="flex flex-col">
        <div className="flex items-center">
          {
            completed ? (
              <div onClick={() => handleSetComplete(id)} className="bg-green-700 p-1 rounded-full cursor-pointer"> 
                <img className="h-4 w-4" src='/check-icon.svg' alt='Check Icon' />
              </div>
            ) : (
              <span onClick={() => handleSetComplete(id)} className="border-solid border border-gray-500 rounded-full p-3 cursor-pointer "></span>
            )
          }
          <p className={`pl-3 ${completed ? "line-through" : ""}`}>
            {title}
          </p>
        </div>
        {category && (
          <p className="pl-10 text-xs text-indigo-400 italic">📂 {category.name}</p>
        )}

      </div>

      <img onClick={() => handleDelete(id)} className="h-5 w-5 cursor-pointer transition-all duration-300 ease-in" src="/close-icon.svg" alt="Close Icon"/>
    </div>
  );
};

export { Todo };
