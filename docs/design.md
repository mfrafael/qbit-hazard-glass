# Hazard Glass — design

## Por quê

A WebUI é a única interface usada no dia a dia, aberta pelo navegador em vários PCs.
O uso é curto: bater o olho pra ver se está tudo bem, adicionar torrent, ajustar categoria
e tag, às vezes filtrar os ativos. O tema existe para deixar isso mais agradável e mais
legível de relance, sem perder nenhuma função da WebUI original.

## Decisões

- **Visual:** base *Acrylic* (vidro fosco sobre fundo escuro com manchas de cor
  desfocadas) com toques *Hazard* (cantos cortados, rótulos em maiúsculas espaçadas, brilho
  só onde há dado vivo). Duas cores com papel fixo: **âmbar = ações/foco**,
  **ciano = dados**. Sempre escuro.
- **Layout:** filtros à esquerda, lista no centro, detalhes do torrent no **painel de
  baixo, como na WebUI original** (recolhível clicando na aba ativa). As 5 abas originais
  ficam. *Histórico:* a 0.1.0 pôs os detalhes numa coluna larga à direita (estilo
  *File Browser*); no uso real a lista perdeu quase todas as colunas (só cabia até
  "Down Speed") e o Conteúdo cortava a Prioridade — a lista precisa da largura toda,
  então voltamos ao painel de baixo.
- **Sem faixa Pulse** (desde a 0.4.0). A 0.1.0 tinha uma faixa no topo com velocidades,
  ratio, espaço livre e contagem por estado; no uso ela repetia o que a barra de status
  já mostra e tirava ~5 linhas da lista, então saiu. Com ela saíram o JS próprio e o
  patch no `client.js` — o tema ficou só CSS + o patch de cores da barra de peças.
- Referências: galeria ps5-homebrew-ui (design *File Browser*, temas
  *Acrylic*, *Hazard*, *Fresh*).

## Abordagens consideradas

| | Abordagem | Troca |
|---|---|---|
| **A (escolhida)** | Reformar a WebUI oficial: cópia da versão alvo + CSS do tema + patches pequenos | Mantém 100% das funções; custo de reaplicar a cada versão, controlado pelo `tools/build.sh` |
| B | UI do zero só pela API | Liberdade total; reimplementar tudo (Opções têm centenas de campos) |
| C | Retematizar uma UI pronta (VueTorrent) | Herda funções; brigar com o design deles e depender de outro projeto |

## Regras de implementação

- Patches mínimos e marcados com `Hazard Glass` no código; todo o resto em arquivos do tema.
- Não alterar margin/padding/width de colunas e painéis do MochaUI (tamanhos são calculados
  em JS); o visual vem de fundo, borda, sombra e `clip-path`.
- O CSP que a WebUI padrão envia é reposto via cabeçalhos customizados na instalação.

## Não-objetivos (por agora)

Tela de login temática, celular, traduções compiladas (`.qm`) — ver `BACKLOG.md`.
