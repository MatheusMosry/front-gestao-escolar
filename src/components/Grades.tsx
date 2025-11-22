import { useState } from 'react';
import { Search, Plus, Download, ChevronDown, ChevronRight, GraduationCap, FileSpreadsheet } from 'lucide-react';

interface Grade {
  id: number;
  studentName: string;
  enrollment: string;
  class: string;
  subject: string;
  grade1: number;
  grade2: number;
  grade3: number;
  grade4: number;
  average: number;
}

export function Grades() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);

  // Dados Mockados (Mantidos)
  const [grades, setGrades] = useState<Grade[]>([
    { id: 1, studentName: 'Ana Silva', enrollment: '2025001', class: '1º Ano A', subject: 'Matemática', grade1: 8.5, grade2: 7.5, grade3: 9.0, grade4: 8.0, average: 8.25 },
    { id: 2, studentName: 'Ana Silva', enrollment: '2025001', class: '1º Ano A', subject: 'Português', grade1: 9.0, grade2: 8.5, grade3: 9.5, grade4: 9.0, average: 9.0 },
    { id: 3, studentName: 'Beatriz Costa', enrollment: '2025003', class: '1º Ano A', subject: 'História', grade1: 9.5, grade2: 9.0, grade3: 9.5, grade4: 10.0, average: 9.5 },
    { id: 4, studentName: 'Beatriz Costa', enrollment: '2025003', class: '1º Ano A', subject: 'Matemática', grade1: 7.5, grade2: 8.0, grade3: 8.5, grade4: 8.0, average: 8.0 },
    { id: 5, studentName: 'Carlos Santos', enrollment: '2025002', class: '2º Ano B', subject: 'Matemática', grade1: 7.0, grade2: 6.5, grade3: 7.5, grade4: 7.0, average: 7.0 },
    { id: 6, studentName: 'Carlos Santos', enrollment: '2025002', class: '2º Ano B', subject: 'Ciências', grade1: 8.0, grade2: 8.5, grade3: 8.0, grade4: 8.5, average: 8.25 },
    { id: 7, studentName: 'Diego Oliveira', enrollment: '2025004', class: '3º Ano C', subject: 'Geografia', grade1: 8.5, grade2: 9.0, grade3: 8.5, grade4: 9.0, average: 8.75 },
    { id: 8, studentName: 'Diego Oliveira', enrollment: '2025004', class: '3º Ano C', subject: 'Matemática', grade1: 6.5, grade2: 7.0, grade3: 7.5, grade4: 7.0, average: 7.0 },
  ]);

  const [formData, setFormData] = useState({
    studentName: '', enrollment: '', class: '', subject: '',
    grade1: '', grade2: '', grade3: '', grade4: '',
  });

  const subjects = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Inglês'];

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.enrollment.includes(searchTerm) ||
      grade.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || grade.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const gradesByClass = filteredGrades.reduce((acc, grade) => {
    if (!acc[grade.class]) acc[grade.class] = [];
    acc[grade.class].push(grade);
    return acc;
  }, {} as Record<string, Grade[]>);

  const toggleClass = (className: string) => {
    setExpandedClasses(prev =>
      prev.includes(className) ? prev.filter(c => c !== className) : [...prev, className]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const g1 = parseFloat(formData.grade1), g2 = parseFloat(formData.grade2), g3 = parseFloat(formData.grade3), g4 = parseFloat(formData.grade4);
    const avg = (g1 + g2 + g3 + g4) / 4;
    const newGrade: Grade = {
      id: grades.length + 1,
      studentName: formData.studentName, enrollment: formData.enrollment, class: formData.class, subject: formData.subject,
      grade1: g1, grade2: g2, grade3: g3, grade4: g4, average: avg,
    };
    setGrades([...grades, newGrade]);
    setShowModal(false);
  };

  const getGradeColor = (average: number) => {
    if (average >= 9) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    if (average >= 7) return 'text-indigo-700 bg-indigo-100 border-indigo-200';
    if (average >= 5) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-rose-700 bg-rose-100 border-rose-200';
  };

  const getClassAverage = (classGrades: Grade[]) => {
    const sum = classGrades.reduce((acc, grade) => acc + grade.average, 0);
    return (sum / classGrades.length).toFixed(2);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Notas e Avaliações</h1>
          <p className="text-slate-500 mt-1">Acompanhe o desempenho acadêmico por turma</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/50 backdrop-blur-md text-slate-600 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Exportar</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="hidden sm:inline font-medium">Lançar Notas</span>
            <span className="sm:hidden">Lançar</span>
          </button>
        </div>
      </div>

      {/* Filtros Glass */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-indigo-100/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, matrícula ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600"
            >
              <option value="all">Todas as Disciplinas</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Turmas */}
      <div className="space-y-4">
        {Object.entries(gradesByClass).map(([className, classGrades]) => {
          const isExpanded = expandedClasses.includes(className);
          const classAverage = getClassAverage(classGrades);

          return (
            <div key={className} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg shadow-indigo-100/10 overflow-hidden transition-all duration-300 hover:shadow-xl">
              <button
                onClick={() => toggleClass(className)}
                className={`w-full px-6 py-5 flex items-center justify-between transition-colors ${isExpanded ? 'bg-indigo-50/50' : 'hover:bg-white/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-800">{className}</h3>
                    <p className="text-sm text-slate-500 font-medium">{classGrades.length} registro(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Média da Turma</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(parseFloat(classAverage))}`}>
                      {classAverage}
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  {/* Tabela Desktop */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50 border-y border-slate-100">
                        <tr className="text-slate-500 text-xs uppercase font-semibold tracking-wider text-left">
                          <th className="px-6 py-3">Estudante</th>
                          <th className="px-6 py-3">Disciplina</th>
                          <th className="px-6 py-3 text-center">1º Bim</th>
                          <th className="px-6 py-3 text-center">2º Bim</th>
                          <th className="px-6 py-3 text-center">3º Bim</th>
                          <th className="px-6 py-3 text-center">4º Bim</th>
                          <th className="px-6 py-3 text-center">Média Final</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50">
                        {classGrades.map((grade) => (
                          <tr key={grade.id} className="hover:bg-indigo-50/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-800">{grade.studentName}</div>
                              <div className="text-xs text-slate-400">Mat: {grade.enrollment}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{grade.subject}</td>
                            {[grade.grade1, grade.grade2, grade.grade3, grade.grade4].map((g, i) => (
                              <td key={i} className="px-6 py-4 text-center font-medium text-slate-700">
                                {g.toFixed(1)}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getGradeColor(grade.average)}`}>
                                {grade.average.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden p-4 space-y-3">
                    {classGrades.map((grade) => (
                      <div key={grade.id} className="bg-white/50 rounded-xl p-4 border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-slate-800">{grade.studentName}</p>
                            <p className="text-xs text-slate-500">{grade.subject}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getGradeColor(grade.average)}`}>
                            Média: {grade.average.toFixed(2)}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[grade.grade1, grade.grade2, grade.grade3, grade.grade4].map((g, i) => (
                            <div key={i} className="bg-slate-50 rounded p-1">
                              <span className="block text-[10px] text-slate-400">{i + 1}º Bim</span>
                              <span className="font-medium text-slate-700">{g.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Glass */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-200" /> Lançar Notas
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* (Mantido os inputs com estilo novo) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['studentName', 'enrollment', 'class', 'subject'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">
                      {field === 'studentName' ? 'Nome do Estudante' : field === 'enrollment' ? 'Matrícula' : field === 'class' ? 'Turma' : 'Disciplina'}
                    </label>
                    {field === 'subject' ? (
                      <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none" onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                        <option>Selecione...</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {['grade1', 'grade2', 'grade3', 'grade4'].map((g, i) => (
                  <div key={g}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{i + 1}º Bim</label>
                    <input type="number" step="0.1" max="10" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      onChange={(e) => setFormData({ ...formData, [g]: e.target.value })} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium border border-slate-200">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-md">Salvar Notas</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}