import { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap, DollarSign, Clock, Calendar, Loader2 } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { AdminDashboardStats } from '../types';

export function Dashboard() {
  const [statsData, setStatsData] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardService.getAdminStats();
        setStatsData(data);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
        // Em caso de erro, o isLoading falso vai mostrar os dados vazios ou de fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Formatação de Moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Configuração dos Cards (Mapeando dados da API para o seu Design)
  const stats = [
    {
      label: 'Total de Estudantes',
      value: statsData?.totalStudents.toString() || '0',
      icon: Users,
      color: 'from-blue-500 to-cyan-400',
      shadow: 'shadow-blue-500/20'
    },
    {
      label: 'Turmas Ativas',
      value: statsData?.totalClasses.toString() || '0',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/20'
    },
    {
      // Alterado de "Média Geral" para "Professores" (Dado real da API Admin)
      label: 'Professores',
      value: statsData?.totalTeachers.toString() || '0',
      icon: GraduationCap,
      color: 'from-orange-500 to-yellow-400',
      shadow: 'shadow-orange-500/20'
    },
    {
      // Alterado de "Taxa de Aprovação" para "Receita Mensal" (Dado real da API Admin)
      label: 'Receita (Mês)',
      value: statsData ? formatCurrency(statsData.revenueThisMonth) : 'R$ 0,00',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-400',
      shadow: 'shadow-purple-500/20'
    },
  ];

  // Mock para atividades (já que a API de dashboard admin não retorna lista de atividades no swagger atual)
  const recentActivities = [
    { action: 'Nova turma criada', detail: '3º Ano - Turma B', time: 'Há 2 horas' },
    { action: 'Notas lançadas', detail: 'Matemática - 2º Ano A', time: 'Há 4 horas' },
    { action: 'Estudante cadastrado', detail: 'João Silva - 1º Ano C', time: 'Há 6 horas' },
    { action: 'Fatura gerada', detail: 'Mensalidade Maio', time: 'Há 1 dia' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-3 animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-slate-500 font-medium">Carregando indicadores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1">Visão geral em tempo real da sua instituição</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-xl shadow-indigo-100/20 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {/* Badge mockado de crescimento */}
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-500 group-hover:bg-white transition-colors">
                  +2.5%
                </span>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-indigo-100/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Atividades Recentes
            </h2>
            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors">Ver tudo</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full ring-4 ring-indigo-100 group-hover:ring-indigo-200 transition-all"></div>
                  {index !== recentActivities.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1"></div>}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <p className="text-slate-800 font-medium text-sm">{activity.action}</p>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Events - Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl shadow-indigo-100/20 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Próximos Eventos
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50/50 rounded-xl border border-indigo-100/50 hover:shadow-md transition-all cursor-default group">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-indigo-900 group-hover:text-indigo-700">Reunião de Pais</p>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded text-indigo-600 shadow-sm">25 NOV</span>
              </div>
              <p className="text-slate-600 text-sm">Apresentação de resultados do 3º bimestre</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-100/50 hover:shadow-md transition-all cursor-default group">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-emerald-900 group-hover:text-emerald-700">Feira de Ciências</p>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded text-emerald-600 shadow-sm">02 DEZ</span>
              </div>
              <p className="text-slate-600 text-sm">Exposição de projetos dos estudantes</p>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-xl border border-amber-100/50 hover:shadow-md transition-all cursor-default group">
              <div className="flex justify-between items-start mb-1">
                <p className="font-semibold text-amber-900 group-hover:text-amber-700">Encerramento</p>
                <span className="text-xs font-bold bg-white px-2 py-1 rounded text-amber-600 shadow-sm">20 DEZ</span>
              </div>
              <p className="text-slate-600 text-sm">Cerimônia de encerramento do ano letivo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}