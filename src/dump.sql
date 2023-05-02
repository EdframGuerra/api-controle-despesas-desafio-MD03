CREATE DATABASE dindin;

CREATE TABLE usuarios(
	ID serial PRIMARY KEY,
  nome text NOT null,
  email text UNIQUE NOT null,
  senha text NOT null
);

CREATE TABLE categorias(
  ID serial PRIMARY KEY,
  descricao text NOT null 
);

CREATE TABLE transacoes(
  ID serial PRIMARY KEY,
  descricao text NOT null,
  valor int NOT null,
  DATA date,
  categoria_id int REFERENCES categorias(ID),
  usuario_id int  REFERENCES usuarios(ID),
  tipo text NOT NULL
);

INSERT INTO categorias(descricao) VALUES
('Alimentacao'), ('Assinaturas_Servicos'),
('Casa'),('Mercado'), ('Cuidados_Pessoais'),
('Educacao'), ('Familia'), ('Lazer'), ('Pets'),
('Presentes'), ('Roupas'), ('Saude'), ('Transporte'),
('Salario'), ('Vendas'), ('Outras_receitas'),
('Outras_despesas');