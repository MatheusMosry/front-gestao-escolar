import { useState } from 'react';
import { Plus, Users, BookOpen, Edit2, Trash2, Clock, MapPin, Calendar } from 'lucide-react';

interface Class {
  id: number;
  name: string;
  grade: string;
  teacher: string;
  students: number;
  schedule: string;
  room: string;
}

export function Classes() {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState<Class[]>([
    { id: 1, name: 'Turma A', grade: '1º Ano', teacher: 'Prof. Maria Santos', students: 32, schedule: 'Manhã (7h-12h)', room: 'Sala 101' },
    { id: 2, name: 'Turma B', grade: '1º Ano', teacher: 'Prof. João Oliveira', students: 28, schedule: 'Tarde (13h-18h)', room: 'Sala 102' },
    { id: 3, name: 'Turma A', grade: '2º Ano', teacher: 'Prof. Ana Costa', students: 30, schedule: 'Manhã (7h-12h)', room: 'Sala 201' },
    { id: 4, name: 'Turma B', grade: '2º Ano', teacher: 'Prof. Pedro Silva', students: 29, schedule: 'Tarde (13h-18h)', room: 'Sala 202' },
    { id: 5, name: 'Turma C', grade: '3º Ano', teacher: 'Prof. Lucia Fernandes', students: 31, schedule: 'Manhã (7h-12h)', room: 'Sala 301' },
  ]);

  const [formData, setFormData] = useState({ name: '', grade: '', teacher: '', students: '', schedule: '', room: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass = { id: Date.now(), name: formData.name, grade: formData.grade, teacher: formData.teacher, students: Number(formData.students), schedule: formData.schedule, room: formData.room };
    setClasses([...classes, newClass]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => setClasses(classes.filter(c => c.id !== id));

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Turmas</h1>
          <p className="text-slate-500 mt-1">Gerenciamento de salas e grades horárias</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span className="font-medium">Nova Turma</span>
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="group bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg shadow-indigo-100/10 hover:shadow-xl hover:shadow-indigo-200/20 hover:-translate-y-1 transition-all duration-300">

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                  {cls.grade.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{cls.grade}</h3>
                  <p className="text-sm text-indigo-600 font-medium">{cls.name}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cls.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium">{cls.students} Alunos</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-white/50 p-2 rounded-lg border border-slate-100">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium truncate">{cls.teacher}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {cls.schedule}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> {cls.room}
                </div>
              </div>
            </div>

            <button className="w-full mt-5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-colors border border-indigo-100">
              Ver Grade Completa
            </button>
          </div>
        ))}
      </div>

      {/* Modal Nova Turma */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-200" /> Nova Turma</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {['name', 'grade', 'teacher', 'students', 'schedule', 'room'].map((f) => (
                <div key={f}>
                  <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                    {f === 'name' ? 'Nome da Turma' : f === 'grade' ? 'Série' : f === 'teacher' ? 'Professor' : f === 'students' ? 'Qtd. Alunos' : f === 'schedule' ? 'Horário' : 'Sala'}
                  </label>
                  <input type={f === 'students' ? 'number' : 'text'} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    onChange={(e) => setFormData({ ...formData, [f]: e.target.value })} />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium border border-slate-200">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-md">Criar Turma</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}