- Iniciando:
  - NPM Start
  - Envie uma requisição POST para: /nodes (host, port) dos nós para conectalos.

- Usando
  - Uma vez conectados, é só mandar uma requisição para um deles para que o outro receba simuntaneamente.
  - Para enviar as transações é só enviar para /transaction para um dos nós e aguardar.
  - Quando o bloco alcançar o tamanho pré definido os dois começaram a minerar-lo até que um deles ache a resposta e passe para o outro verificar.
  - Sendo verificado pelo outro a transação se torna válida.
  