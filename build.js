/**
 * ═══════════════════════════════════════════════════════════════════════
 * BUILD — injeta as variáveis de ambiente da Vercel no template.html
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Roda automaticamente a cada deploy (configurado no vercel.json). Lê o
 * template.html (o mesmo arquivo, igual pra todos os clientes) e troca
 * os espaços reservados (__SUPABASE_URL__ etc.) pelos valores reais
 * daquele projeto Vercel específico — sem precisar editar HTML na mão
 * pra cada restaurante.
 *
 * Variáveis exigidas no projeto Vercel de CADA cliente:
 *   SUPABASE_URL          → URL do projeto Supabase daquele restaurante
 *   SUPABASE_ANON_KEY      → anon key do Supabase daquele restaurante
 *   EMPRESA_ID             → identificador único daquele restaurante
 *   PAYMENTS_API_BASE      → endereço do backend de pagamentos (o mesmo
 *                            pra todos os clientes — só repete sempre)
 * ═══════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const OBRIGATORIAS = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'EMPRESA_ID', 'PAYMENTS_API_BASE'];
const faltando = OBRIGATORIAS.filter((v) => !process.env[v]);

if (faltando.length) {
  console.error(
    `\n❌ Faltam variáveis de ambiente neste projeto Vercel: ${faltando.join(', ')}\n` +
    `Configure em: Vercel → este projeto → Settings → Environment Variables\n`
  );
  process.exit(1);
}

const templatePath = path.join(__dirname, 'template.html');
let html = fs.readFileSync(templatePath, 'utf8');

html = html
  .replaceAll('__SUPABASE_URL__', process.env.SUPABASE_URL)
  .replaceAll('__SUPABASE_ANON_KEY__', process.env.SUPABASE_ANON_KEY)
  .replaceAll('__EMPRESA_ID__', process.env.EMPRESA_ID)
  .replaceAll('__PAYMENTS_API_BASE__', process.env.PAYMENTS_API_BASE);

fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'public', 'index.html'), html);

console.log(`✅ Build concluído para empresa: ${process.env.EMPRESA_ID}`);
