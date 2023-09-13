# AQuaTiC Betta

Minha entrada na [Rinha de Compiladores](https://github.com/aripiprazole/rinha-de-compiler),
de nome inspirado no peixe Betta (pq eles brigam, tipo galos, sacou?).

O que eu de fato pretendo fazer é (provavelmente, mas não necessariamente, nessa ordem):

* Um interpretador, que rode a partir da AST em JSON;
* Um transpilador, usando a AST em JSON pra gerar código equivalente em outras langs;
  * Algumas langs candidatas, escolhidas pelo fato de eu conhecer elas, são: C/C++, Python, JS/TS, HVM/Kind
* Um parser, pra parsear a linguagem da rinha, gerando a AST em JSON;
  * Dado que eu dificilmente farei um parser "de verdade",
  eu provavelmente irei declarar a linguagem `.rinha` como uma DSL
* Dando tempo, eu colo o "parser" nas outras duas funcionalidades, removendo a necessidade do arquivo JSON.

Não estou me preocupando inicialmente em fazer a coisa ser eficiente (se eficiência for um critério mto grande da competição, devo rodar lol).
Depois de tudo, ou quase tudo, feito, eu devo ver qual combinação (interpretado ou transpilado? com ou sem parser?) parece mais promissora em eficiência, e tento polir ela

Linguagem de escolha: TypeScript
