import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Loader2, AlertCircle, GraduationCap } from 'lucide-react';
import { studentsService } from '../services/studentsService';
import { User } from '../types';

export function Students() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Lógica de Integração (Mantida Original) ---
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'none' | 'auth' | 'connection'>('none');

  // Dados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    enrollment: '',
  });

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      setErrorType('none');

      const response = await studentsService.getAll();

      // BLINDAGEM: Verifica o que veio da API
      console.log("Dados da API:", response);

      if (Array.isArray(response)) {
        setStudents(response);
      } else if (response && Array.isArray((response as any).data)) {
        // Caso sua API retorne { data: [], total: 10 } (paginação)
        setStudents((response as any).data);
      } else {
        console.warn("Formato de dados inesperado:", response);
        setStudents([]);
      }

    } catch (err: any) {
      console.error("Erro API:", err);

      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setErrorType('auth');
      } else {
        setErrorType('connection');
      }

    } finally {
      setIsLoading(false);
    }
    // Log adicional solicitado
    const responseLog = await studentsService.getAll();
    console.log("DADOS RECEBIDOS DO BACKEND:", responseLog);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const safeStudents = Array.isArray(students) ? students : [];

  const filteredStudents = safeStudents.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.enrollment && student.enrollment.includes(searchTerm))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    alert("Para salvar de verdade, precisaremos fazer o Login no próximo passo!");
  };

  const handleDelete = (id: string) => {
    alert("Funcionalidade de excluir aguardando autenticação.");
  };

  // --- Renderização Visual (Novo Design) ---
  return (
    <div className="animate-in fade-in duration-500">

      {/* Cabeçalho Moderno */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Estudantes</h1>
          <p className="text-slate-500 mt-1">Gerencie os estudantes cadastrados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>Novo Estudante</span>
        </button>
      </div>

      {/* Alertas de Erro com estilo Glass */}
      {errorType !== 'none' && (
        <div className={`mb-6 rounded-xl border p-4 flex items-start gap-3 backdrop-blur-md shadow-sm animate-in slide-in-from-top-2 ${errorType === 'auth'
            ? 'bg-amber-50/80 border-amber-200 text-amber-800'
            : 'bg-red-50/80 border-red-200 text-red-800'
          }`}>
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold">{errorType === 'auth' ? 'Modo Demonstração (Sem Login)' : 'Erro de Conexão'}</h4>
            <p className="text-sm opacity-90 mt-1">
              {errorType === 'auth'
                ? 'Exibindo dados fictícios. O backend está bloqueando o acesso real até que o login seja feito.'
                : 'Não foi possível conectar ao servidor.'}
            </p>
          </div>
        </div>
      )}

      {/* Container Principal Glassmorphism */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-indigo-100/10 overflow-hidden flex flex-col">

        {/* Barra de Busca */}
        <div className="p-6 border-b border-slate-100/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, matrícula ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Conteúdo da Tabela */}
        {isLoading ? (
          <div className="p-20 flex justify-center items-center flex-col gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <span className="text-slate-500 font-medium">Carregando estudantes...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-semibold tracking-wider text-left">
                <tr>
                  <th className="px-6 py-4">Estudante</th>
                  <th className="px-6 py-4">Turma</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar com Iniciais */}
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                          {(student.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-500">Mat: {student.enrollment || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {student.class || 'Sem turma'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {student.phone || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${student.status === 'inactive'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'inactive' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                        {student.status === 'inactive' ? 'Inativo' : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Estado Vazio se não houver alunos */}
            {!isLoading && filteredStudents.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-slate-800 font-medium mb-1">Nenhum estudante encontrado</h3>
                <p className="text-slate-500 text-sm">Tente ajustar sua busca ou adicione um novo registro.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Moderno */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-200" />
                Novo Estudante
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white transition-colors">
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ex: Maria Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Matrícula</label>
                  <input
                    type="text"
                    required
                    value={formData.enrollment}
                    onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Turma</label>
                  <input
                    type="text"
                    required
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}