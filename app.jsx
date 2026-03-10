import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  // 1. 初始化存储：从本地持久化空间读取
  const [todos, setTodos] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vercel_todo_data');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState({ task: '', date: '', note: '', priority: '普通' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. 自动持久化：每当 todos 改变，存入 localStorage
  useEffect(() => {
    localStorage.setItem('vercel_todo_data', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.task.trim()) return;

    if (editingId) {
      setTodos(todos.map(t => t.id === editingId ? { ...formData, id: editingId } : t));
      setEditingId(null);
    } else {
      setTodos([{ ...formData, id: Date.now(), completed: false }, ...todos]);
    }
    setFormData({ task: '', date: '', note: '', priority: '普通' });
  };

  const deleteTodo = (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setTodos(todos.filter(t => t.id !== id));
    }
  };

  // 导出数据功能 (防止浏览器清理缓存导致丢失)
  const exportData = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `todo-backup-${new Date().toLocaleDateString()}.json`);
    linkElement.click();
  };

  const filteredTodos = todos.filter(t => t.task.includes(searchTerm));

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-indigo-600 italic">TASK MASTER</h1>
            <p className="text-slate-500 font-medium">Vercel Cloud Ready 🚀</p>
          </div>
          <button 
            onClick={exportData}
            className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-slate-600"
          >
            备份数据 (JSON)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 左侧：输入表单 */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                {editingId ? '📝 编辑任务' : '✨ 新建任务'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">任务名称</label>
                  <input
                    name="task"
                    required
                    value={formData.task}
                    onChange={(e) => setFormData({...formData, task: e.target.value})}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="去做什么？"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-400 ml-1">日期</label>
                    <input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 ml-1">优先级</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option>普通</option>
                      <option>重要</option>
                      <option>紧急</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-1">备注</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full mt-1 px-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows="3"
                    placeholder="可选详情..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  {editingId ? '保存更新' : '确认添加'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {setEditingId(null); setFormData({task:'', date:'', note:'', priority:'普通'})}}
                    className="w-full text-slate-400 text-sm py-1"
                  >
                    取消编辑
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* 右侧：列表展示 */}
          <div className="lg:col-span-3 space-y-4">
            <input 
              type="text"
              placeholder="🔍 搜索任务..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="space-y-3">
              {filteredTodos.map(todo => (
                <div key={todo.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        todo.priority === '紧急' ? 'bg-red-100 text-red-600' : 
                        todo.priority === '重要' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {todo.priority}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{todo.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-tight">{todo.task}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{todo.note}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => deleteTodo(todo.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button onClick={() => startEdit(todo)} className="p-2 text-slate-300 hover:text-indigo-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;