import React, { useState, useEffect } from 'react';
import { Plus, Users, BookOpen, Edit2, Trash2, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { classesService } from '../services/classesService';
import { studentsService } from '../services/studentsService'; 
import { User } from '../types';

interface ClassView {
  id: string;
  name: string;
  grade: string; 
  teacherName: string;
  teacherId?: string;
  studentsCount: number;
  schedule?: string; // Mantido nos dados caso precise no futuro
  room?: string;     // Mantido nos dados caso precise no futuro
}

export function Classes() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [classes, setClasses] = useState<ClassView[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'auth' | 'connection'>('none');

  // Estado para controlar Edição
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    teacherId: '',
    schedule: '',
    room: ''
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorType('none');

      // 1. Busca Turmas
      const data = await classesService.getAll();
      
      const adaptedClasses: ClassView[] = data.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        grade: cls.academic_year?.toString() || new Date().getFullYear().toString(),
        teacherName: cls.teacher?.name || 'Sem Professor',
        teacherId: cls.teacherId,
        // Tenta contar alunos de várias formas (lista de students ou lista de enrollments)
        studentsCount: cls.students?.length || cls.enrollments?.length || 0,
        schedule: cls.schedule || '', 
        room: cls.room || ''
      }));
      setClasses(adaptedClasses);

      // 2. Busca Professores
      try {
        const users = await studentsService.getAll();
        const teacherList = users.filter((u: any) => u.role === 'teacher' || u.name.startsWith('Prof'));
        setTeachers(teacherList.length > 0 ? teacherList : []); 
      } catch (e) {
        console.warn("Erro ao carregar lista de professores");
      }

    } catch (err: any) {
      console.error("Erro API Classes:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrorType('auth');
      } else {
        setErrorType('connection');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLERS ---

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', grade: '', teacherId: '', schedule: '', room: '' });
    setShowModal(true);
  };

  const handleEdit = (cls: ClassView) => {
    setEditingId(cls.id);
    setFormData({
      name: cls.name,
      grade: cls.grade,
      teacherId: cls.teacherId || '',
      schedule: cls.schedule || '',
      room: cls.room || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        academic_year: parseInt(formData.grade) || new Date().getFullYear(),
        teacherId: formData.teacherId,
        schedule: formData.schedule,
        room: formData.room
      };

      if (editingId) {
        await classesService.update(editingId, payload);
        alert("Turma atualizada com sucesso!");
      } else {
        await classesService.create(payload);
        alert("Turma criada com sucesso!");
      }
      
      setShowModal(false);
      fetchData(); 
    } catch (err) {
      alert("Erro ao salvar turma. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza? Excluir a turma pode afetar matrículas.")) return;
    try {
        await classesService.delete(id);
        setClasses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
        alert("Erro ao excluir turma.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Turmas</h1>
          <p className="text-slate-500 mt-1">Gerenciamento de salas e grades horárias</p>
        </div>
        <button
          onClick={handleAddNew}
          className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="font-medium">Nova Turma</span>
        </button>
      </div>

      {/* Alerta de Erro */}
      {errorType !== 'none' && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 backdrop-blur-md shadow-sm ${
          errorType === 'auth' ? 'bg-amber-50/80 border-amber-200 text-amber-800' : 'bg-red-50/80 border-red-200 text-red-800'
        }`}>
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">{errorType === 'auth' ? 'Acesso Restrito' : 'Erro de Conexão'}</h4>
            <p className="text-sm opacity-90 mt-1">
              {errorType === 'auth' ? 'Sessão expirada.' : 'Não foi possível carregar as turmas.'}
            </p>
          </div>
        </div>
      )}

      {/* Grid de Cards */}
      {isLoading ? (
        <div className="p-20 flex justify-center items-center flex-col gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <span className="text-slate-500 font-medium">Carregando turmas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg shadow-indigo-100/10 hover:shadow-xl hover:shadow-indigo-200/20 hover:-translate-y-1 transition-all duration-300">

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                    {cls.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{cls.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">Ano: {cls.grade}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button 
                    onClick={() => handleEdit(cls)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cls.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600 bg-white/50 p-3 rounded-xl border border-slate-100/50">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium">{cls.studentsCount} Alunos Matriculados</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-white/50 p-3 rounded-xl border border-slate-100/50">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium truncate">{cls.teacherName}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Nova/Editar Turma */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-200" /> 
                {editingId ? 'Editar Turma' : 'Nova Turma'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome da Turma</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: 3º Ano A"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ano Letivo</label>
                <input 
                  type="number" 
                  required
                  placeholder="2025"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Professor</label>
                <select 
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer transition-all"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-medium transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Salvar Alterações' : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}