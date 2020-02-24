# tor_aux

Esse projeto cria uma ferramenta que auxilia na busca de suas series favoritas

## Main routes
get('/full') - Exibe episodios do banco e novos

get('/refresh') - Exibe apenas episodios novos

get('/recent') - Exibe os ultimos episodios adiconados ao banco 

get('/') - Exibe informações gerais do serviço

## Link routes
get('/link') - Exibe prompt para gerar link do algoritmo PSA

## Management
get('/list') - Exibe lista com series no banco e link para as /esp respectivas

get('/create') - Exibe prompt para criar nova serie no banco

get('/remove') - Exibe prompt para remover serie do banco

get('/db') - Exibe em plain text o banco

## Notas
Rota de post foram omitidas