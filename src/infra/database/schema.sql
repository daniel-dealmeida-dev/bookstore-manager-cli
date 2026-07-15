CREATE TABLE IF NOT EXISTS autores(
    id SERIAL PRIMARY KEY,
    nome VARCHAR (100) NOT NULL,
    nacionalidade VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS livros(
    id SERIAL PRIMARY KEYm
    titulo VARCHAR(100) NOT NULL,
    autor_id INTEGER REFERENCES autores(id),
    quantidade_disponivel INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXIST clientes(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
);

CREATE TABLE IF NOT EXIST emprestimos(
    id SERIAL PRIMARY KEY,
    livro_id INTEGER REFERENCES livros(id),
    cliente_id INTEGER REFERENCES livros(id),
    data_emprestimo  DATE DEFAULT CURRENT_DATE,
    data_devolucao DATE
)