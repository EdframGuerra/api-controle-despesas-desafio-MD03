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
  descricao text NOT null 
);

--criação da tabela transações:
CREATE TABLE transacoes(
  ID serial PRIMARY KEY,
  descricao text NOT null,
  valor int NOT null,
  DATA date,
  categoria_id int REFERENCES categorias(ID),
  usuario_id int  REFERENCES usuarios(ID),
  tipo text NOT NULL
);

--inserção de descrição da tabela categorias
INSERT INTO categorias(descricao) VALUES
('Alimentacao'), ('Assinaturas_Servicos'),
('Casa'),('Mercado'), ('Cuidados_Pessoais'),
('Educacao'), ('Familia'), ('Lazer'), ('Pets'),
('Presentes'), ('Roupas'), ('Saude'), ('Transporte'),
('Salario'), ('Vendas'), ('Outras_receitas'),
('Outras_despesas');