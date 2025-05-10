// src/components/TodoInput.jsx
import { useState } from "react";

const TodoInput = ({ addTodo, categories }) => {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddTodo = (e) => {
    if (e.key.toLowerCase() === 'enter') {
      if (title.trim() === '' || !selectedCategory) {
        alert('Por favor, ingresa un título y selecciona una categoría');
        return;
      }
      addTodo(title, Number(selectedCategory));
      setTitle('');
      setSelectedCategory(null); // Resetea la categoría después de agregar
    }
  };

  return (
    <div className="mt-6 relative">
      <input
        type="text"
        className="focus:shadow-lg font-inter focus:shadow-blue-800 pl-12 w-full py-4 bg-gray-700 rounded-xl outline-none transition-all duration-300 ease-in-out"
        placeholder="¿Qué sigue?..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleAddTodo}
      />
      <div className="mt-2">
        <select
          className="w-full bg-gray-700 text-white py-2 rounded-md"
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>Selecciona categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}

        </select>
      </div>
    </div>
  );
};

export { TodoInput };
