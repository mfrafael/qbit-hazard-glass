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
- **Layout:** *File Browser* — filtros à esquerda, lista no centro, detalhes do torrent
  numa **coluna larga à direita** (escolhida contra "painel embaixo" e "coluna que
  expande"). As 5 abas originais (Geral, Trackers, Peers, Fontes HTTP, Conteúdo) ficam.
- **Faixa Pulse** no topo (influência do *Pulse Dashboard*): download e upload com
  mini-gráfico, ratio global, espaço livre + conexão, contagem por estado.
- Referências: galeria ps5-homebrew-ui (designs *File Browser* e *Pulse Dashboard*, temas
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
- A faixa Pulse só **lê** dados que o `client.js` já busca (eventos `hazardglass:*`).
- O CSP que a WebUI padrão envia é reposto via cabeçalhos customizados na instalação.

## Não-objetivos (por agora)

Tela de login temática, celular, traduções compiladas (`.qm`) — ver `BACKLOG.md`.
