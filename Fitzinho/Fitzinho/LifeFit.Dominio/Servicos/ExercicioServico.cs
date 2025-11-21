using FGB.Dominio.Repositorios.IRepositorios;
using FGB.Dominio.Servicos;
using LifeFit.Dominio.Entidades;
using LifeFit.Dominio.ObjetosValor;

namespace LifeFit.Dominio.Servicos
{
    public class ExercicioServico : ServicoCrud<Exercicio>
    {
        public ExercicioServico(IRepositorio repo) : base(repo)
        {
        }

        public override bool Valida(Exercicio entidade)
        {
            if (!base.Valida(entidade))
                return false;
            try
            {
                entidade.FocoMuscular = GetFoco(entidade.Nome);
            }
            catch
            {
                Mensagens.Add("Exercício não mapeado para um foco muscular.");
                return false;
            }

            return true;
        }

        public static FocoMuscular GetFoco(ExercicioEnum exercicio)
        {
            switch (exercicio)
            {
                // ------------------ PEITO ------------------
                case ExercicioEnum.SupinoRetoBarra:
                case ExercicioEnum.SupinoInclinadoHalteres:
                case ExercicioEnum.CrucifixoMaquina:
                case ExercicioEnum.FlexaoDeBraco:
                case ExercicioEnum.CrossoverPoliaAlta:
                case ExercicioEnum.Pullover:
                    return FocoMuscular.Peito;

                // ------------------ COSTAS ------------------
                case ExercicioEnum.PuxadaAltaAberta:
                case ExercicioEnum.RemadaCurvadaBarra:
                case ExercicioEnum.RemadaBaixaTriangulo:
                case ExercicioEnum.SerroteUnilateral:
                case ExercicioEnum.LevantamentoTerra:
                case ExercicioEnum.BarraFixa:
                    return FocoMuscular.Costas;

                // ------------------ PERNAS ------------------
                case ExercicioEnum.AgachamentoLivre:
                case ExercicioEnum.LegPress45:
                case ExercicioEnum.CadeiraExtensora:
                case ExercicioEnum.MesaFlexora:
                case ExercicioEnum.Stiff:
                case ExercicioEnum.AfundoComHalteres:
                case ExercicioEnum.PanturrilhaEmPe:
                    return FocoMuscular.Pernas;

                // ------------------ OMBROS ------------------
                case ExercicioEnum.DesenvolvimentoMilitar:
                case ExercicioEnum.ElevacaoLateral:
                case ExercicioEnum.ElevacaoFrontal:
                case ExercicioEnum.CrucifixoInverso:
                case ExercicioEnum.RemadaAlta:
                    return FocoMuscular.Ombros;

                // ------------------ BÍCEPS ------------------
                case ExercicioEnum.RoscaDiretaBarra:
                case ExercicioEnum.RoscaAlternada:
                case ExercicioEnum.RoscaMartelo:
                case ExercicioEnum.RoscaScott:
                    return FocoMuscular.Biceps;

                // ------------------ TRÍCEPS ------------------
                case ExercicioEnum.TricepsPulleyCorda:
                case ExercicioEnum.TricepsTesta:
                case ExercicioEnum.TricepsBanco:
                case ExercicioEnum.TricepsFrances:
                    return FocoMuscular.Triceps;

                // ------------------ CARDIO / GERAL ------------------
                case ExercicioEnum.CorridaEsteira:
                case ExercicioEnum.BicicletaErgonometrica:
                case ExercicioEnum.Eliptico:
                case ExercicioEnum.PularCorda:
                case ExercicioEnum.Burpees:
                case ExercicioEnum.Polichinelos:
                case ExercicioEnum.PranchaAbdominal:
                case ExercicioEnum.AbdominalCrunch:
                    return FocoMuscular.CardioGeral;

                default:
                    throw new ArgumentOutOfRangeException(nameof(exercicio), "Exercício não mapeado.");
            }
        }
    }
}