
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar tags iniciais
  const tagsIniciais = [
    {
      nome: 'Estratégia',
      cor: '#2563EB', // Azul
      posicao: 1
    },
    {
      nome: 'Sucesso',
      cor: '#16A34A', // Verde
      posicao: 2
    },
    {
      nome: 'Falha',
      cor: '#DC2626', // Vermelho
      posicao: 3
    },
    {
      nome: 'Observação',
      cor: '#FBBF24', // Amarelo
      posicao: 4
    }
  ];

  console.log('📋 Criando tags iniciais...');
  for (const tag of tagsIniciais) {
    await prisma.tag.upsert({
      where: { nome: tag.nome },
      update: {},
      create: tag
    });
  }

  // Criar templates iniciais
  const templatesIniciais = [
    {
      titulo: 'Análise de Estratégia',
      conteudo: `📊 ANÁLISE DE ESTRATÉGIA

🎯 Objetivo da Estratégia:
- [Descrever o objetivo principal]

📈 Condições de Entrada:
- [Listar critérios de entrada]

📉 Condições de Saída:
- [Listar critérios de saída]

⚠️ Gestão de Risco:
- [Definir stop loss e take profit]

💭 Observações Adicionais:
- [Notas importantes sobre o teste]`
    },
    {
      titulo: 'Resultado de Backtest',
      conteudo: `📊 RESULTADO DO BACKTEST

📈 Performance:
- Retorno Total: [%]
- Sharpe Ratio: [valor]
- Máximo Drawdown: [%]
- Taxa de Acerto: [%]

📅 Período Testado:
- Data Inicial: [dd/mm/aaaa]
- Data Final: [dd/mm/aaaa]

🎯 Trades:
- Total de Trades: [número]
- Trades Positivos: [número]
- Trades Negativos: [número]

💡 Conclusões:
- [Principais insights e conclusões]`
    },
    {
      titulo: 'Observações Rápidas',
      conteudo: `✅ Pontos Positivos:
- 
- 
- 

❌ Pontos Negativos:
- 
- 
- 

🔄 Melhorias Possíveis:
- 
- 
- 

📝 Próximos Passos:
- 
- 
-`
    }
  ];

  console.log('📝 Criando templates iniciais...');
  for (const template of templatesIniciais) {
    const templateExistente = await prisma.template.findFirst({
      where: { titulo: template.titulo }
    });
    
    if (!templateExistente) {
      await prisma.template.create({
        data: template
      });
    }
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📋 ${tagsIniciais.length} tags criadas`);
  console.log(`📝 ${templatesIniciais.length} templates criados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
