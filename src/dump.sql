--criação do banco de dados:
CREATE DATABASE dindin;

--criação da tabela usuarios:
CREATE TABLE usuarios(
	ID serial PRIMARY KEY,
  nome text NOT null,
  email text UNIQUE NOT null,
  senha text NOT null
);

--criação da tabela categorias:
CREATE TABLE categorias(
  ID serial PRIMARY KEY,
  descrição text NOT null 
);

--criação da tabela transações:
CREATE TABLE transacoes(
  ID serial PRIMARY KEY,
  descricao text NOT null,
  valor int NOT null,
  DATA date,
  categoria_id integer REFERENCES categorias(ID),
  usuario_id integer  REFERENCES usuarios(ID),
  tipo text NOT NULL
);