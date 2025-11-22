import { useState } from 'react';
import { Plus, Pin, Trash2, Calendar, User, Megaphone, AlertTriangle, Info, Star } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'general' | 'event' | 'urgent' | 'academic';
  pinned: boolean;
}

export function Announcements() {
  const [showModal, setShowModal] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: 'Reunião de Pais - 3º Bimestre', content: 'Convidamos todos os pais e responsáveis para a reunião de apresentação dos resultados do 3º bimestre. A reunião acontecerá no dia 25/11/2025 às 19h no auditório principal.', author: 'Direção', date: '2025-11-18', category: 'event', pinned: true },
    { id: 2, title: 'Inscrições Abertas - Feira de Ciências', content: 'As inscrições para a Feira de Ciências 2025 estão abertas! Os estudantes interessados devem se inscrever até o dia 30/11 na secretaria.', author: 'Coordenação', date: '2025-11-15', category: 'academic', pinned: true },
    { id: 3, title: 'Manutenção do Sistema', content: 'Informamos que o sistema estará em manutenção no dia 22/11 das 22h às 2h.', author: 'TI', date: '2025-11-20', category: 'general', pinned: false },
    { id: 4, title: 'Alteração no Calendário', content: 'Devido ao feriado prolongado, as aulas do dia 15/11 foram transferidas.', author: 'Secretaria', date: '2025-11-10', category: 'urgent', pinned: false },
  ]);

  const [formData, setFormData] = useState({ title: '', content: '', category: 'general' as Announcement['category'] });

  const categoryConfig = {
    general: { label: 'Geral', bg: 'bg-slate-100', text: 'text-slate-600', icon: Info },
    event: { label: 'Evento', bg: 'bg-purple-100', text: 'text-purple-600', icon: Calendar },
    urgent: { label: 'Urgente', bg: 'bg-rose-100', text: 'text-rose-600', icon: AlertTriangle },
    academic: { label: 'Acadêmico', bg: 'bg-emerald-100', text: 'text-emerald-600', icon: Star },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = { id: Date.now(), title: formData.title, content: formData.content, author: 'Admin', date: new Date().toISOString().split('T')[0], category: formData.category, pinned: false };
    setAnnouncements([newAnn, ...announcements]);
    setShowModal(false);
  };

  const sorted = [...announcements].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Quadro de Avisos</h1>
          <p className="text-slate-500 mt-1">Comunicação oficial para a comunidade escolar</p>
        </div>
        <button onClick={() => setShowModal(true)} className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> <span className="font-medium">Novo Anúncio</span>
        </button>
      </div>

      <div className="grid gap-4">
        {sorted.map((item) => {
          const CatIcon = categoryConfig[item.category].icon;
          return (
            <div key={item.id} className={`relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md ${item.pinned ? 'border-indigo-200 shadow-indigo-100/50 bg-indigo-50/30' : 'border-white/50'}`}>
              {item.pinned && <div className="absolute -top-3 -left-3 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg z-10"><Pin className="w-4 h-4 fill-current" /></div>}

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${categoryConfig[item.category].bg} ${categoryConfig[item.category].text}`}>
                      <CatIcon className="w-3.5 h-3.5" /> {categoryConfig[item.category].label}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4">{item.content}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 justify-end sm:justify-center">
                  <button onClick={() => setAnnouncements(prev => prev.map(a => a.id === item.id ? { ...a, pinned: !a.pinned } : a))}
                    className={`p-2 rounded-lg transition-colors ${item.pinned ? 'text-indigo-600 bg-indigo-100' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`} title={item.pinned ? "Desafixar" : "Fixar"}>
                    <Pin className="w-5 h-5" />
                  </button>
                  <button onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== item.id))}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Excluir">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg flex items-center gap-2"><Megaphone className="w-5 h-5 text-indigo-200" /> Criar Anúncio</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input type="text" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Resumo do assunto" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })}>
                  <option value="general">Geral</option>
                  <option value="event">Evento</option>
                  <option value="urgent">Urgente</option>
                  <option value="academic">Acadêmico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo</label>
                <textarea required rows={5} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                  value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Digite a mensagem completa..." />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-medium border border-slate-200">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium shadow-md">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}