// src/pages/NotesPage.jsx
import { useEffect, useState } from "react";
import { Title } from "../components/Title";
import { TodoInput } from "../components/TodoInput";
import { TodoList } from "../components/TodoList";
import * as todoService from '../services/todoService';

export const NotesPage = ({ user, onLogout }) => { 
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); 
    const [filteredTodos, setFilteredTodos] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const todosRes = await todoService.getTodos();
                const catRes = await todoService.getCategories();
                setTodos(todosRes.data);
                setFilteredTodos(todosRes.data); 
                setCategories(catRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                onLogout();
            }
        };
        fetchData();
    }, [onLogout]);

    const addTodo = async (title, categoryId) => {
        try {
            const response = await todoService.addTodo(title, categoryId); 
            const newTodo = response.data;
            setTodos([...todos, newTodo]);
        } catch (err) {
            console.error("Error al agregar todo:", err);
        }
    };

    const handleSetComplete = async (id) => {
        const res = await todoService.toggleTodo(id);
        const updated = todos.map(todo =>
            todo.id === id ? res.data : todo
        );
        setTodos(updated);
    };

    const handleDelete = async (id) => {
        await todoService.deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleClearComplete = async () => {
        await todoService.clearCompleted();
        setTodos(todos.filter(todo => !todo.completed));
    };

    const showAllTodos = () => setActiveFilter('all');
    const showActiveTodos = () => setActiveFilter('active');
    const showCompletedTodos = () => setActiveFilter('completed');

    useEffect(() => {
        let todosToFilter = [...todos];

        if (activeFilter === 'active') {
            todosToFilter = todosToFilter.filter(todo => !todo.completed);
        } else if (activeFilter === 'completed') {
            todosToFilter = todosToFilter.filter(todo => todo.completed);
        }

        if (selectedCategoryId) {
            todosToFilter = todosToFilter.filter(todo => 
                String(todo.category_id) === String(selectedCategoryId)
            );
        }

        setFilteredTodos(todosToFilter);
    }, [activeFilter, todos, selectedCategoryId]);

    return (
        <div className="bg-gray-900 min-h-screen h-full font-inter text-gray-100 flex items-center justify-center py-20 px-5">
            <div className="container flex flex-col max-w-xl">
                {/* Botón de Cerrar Sesión */}
                <button
                    onClick={onLogout}
                    className="self-end mb-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                    Cerrar Sesión
                </button>

                <Title />
                <TodoInput addTodo={addTodo} categories={categories} />
                <TodoList
                    todos={filteredTodos}
                    activeFilter={activeFilter}
                    handleSetComplete={handleSetComplete}
                    handleDelete={handleDelete}
                    showAllTodos={showAllTodos}
                    showActiveTodos={showActiveTodos}
                    showCompletedTodos={showCompletedTodos}
                    handleClearComplete={handleClearComplete}
                    categories={categories}
                />
            </div>
        </div>
    );
}