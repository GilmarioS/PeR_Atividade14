// Importar os estilos CSS do arquivo App.css
import './App.css';
import React, { useEffect, useState } from "react";
import { firestore } from "./firebase";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

function App() {
  // Estado para armazenar os dados da coleção "produtos"
  const [data, setData] = useState([]);
  
  // Estado para armazenar os valores do novo item a ser adicionado
  const [newItem, setNewItem] = useState({
    nome: "",
    quantidade: "",
    valor: ""
  });
  
  // Estado para armazenar o ID do item sendo editado
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    // Função assíncrona para buscar os dados da coleção "produtos" no Firestore
    const fetchData = async () => {
      const snapshot = await firestore.collection("produtos").get();
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(items);
    };

    fetchData();
  }, []);

  // Função para lidar com a exclusão de um item
  const handleDelete = async (id) => {
    try {
      // Deletar o documento correspondente ao ID no Firestore
      await firestore.collection("produtos").doc(id).delete();
      
      // Atualizar a lista de itens removendo o item excluído
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    } catch (error) {
      console.error("Erro ao excluir o documento:", error);
    }
  };

  // Função para lidar com a adição de um novo item
  const handleAdd = async () => {
    try {
      // Adicionar o novo item como um documento na coleção "produtos" no Firestore
      const docRef = await firestore.collection("produtos").add(newItem);
      
      // Criar um novo objeto do item com o ID gerado e os valores fornecidos
      const newItemWithId = {
        id: docRef.id,
        ...newItem
      };
      
      // Atualizar a lista de itens adicionando o novo item
      setData([...data, newItemWithId]);
      
      // Limpar os campos de novo item
      setNewItem({
        nome: "",
        quantidade: "",
        valor: ""
      });
    } catch (error) {
      console.error("Erro ao adicionar o documento:", error);
    }
  };

  // Função para lidar com a edição de um item
  const handleEdit = async (id) => {
    // Encontrar o item a ser editado com base no ID
    const itemToEdit = data.find((item) => item.id === id);

    // Atualizar os valores do formulário com os dados do item
    setNewItem({
      nome: itemToEdit.nome,
      quantidade: itemToEdit.quantidade,
      valor: itemToEdit.valor
    });

    // Definir o ID do item sendo editado
    setEditItemId(id);
  };

  // Função para lidar com a salvamento da edição de um item
  // Função para salvar as alterações feitas em um item em modo de edição
const handleSaveEdit = async () => {
  try {
    // Atualizar os dados do item no Firestore
    await firestore.collection("produtos").doc(editItemId).update(newItem);

    // Atualizar a lista de itens com o item editado
    const updatedData = data.map((item) => {
      if (item.id === editItemId) {
        return {
          id: item.id,
          ...newItem
        };
      }
      return item;
    });
    setData(updatedData);

    // Limpar os campos de edição
    setNewItem({
      nome: "",
      quantidade: "",
      valor: ""
    });
    setEditItemId(null);
  } catch (error) {
    console.error("Erro ao editar o documento:", error);
  }
};

// Função para lidar com as mudanças nos campos de entrada
const handleChange = (e) => {
  setNewItem({
    ...newItem,
    [e.target.name]: e.target.value
  });
};

return (
  <div>
    <div className="title-bar">
      <h1>App Estoque Dados Cadastrados</h1>
    </div>

    <div className="data-grid">
      {/* Renderizar os itens da lista de dados */}
      {data.map((item) => (
        <div key={item.id} className="data-item">
          <p>Nome: {item.nome}</p>
          <p>Quantidade: {item.quantidade}</p>
          <p>Valor: {item.valor}</p>
          <div className="button-group">
            {/* Verificar se o item está em modo de edição */}
            {editItemId === item.id ? (
              // Renderizar botões de atualizar e cancelar edição
              <>
                <button className="update-button" onClick={handleSaveEdit}>
                  Atualizar
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setEditItemId(null)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              // Renderizar botões de edição e exclusão
              <>
                <button className="edit-button" onClick={() => handleEdit(item.id)}>
                  <FaEdit />
                </button>
                <button className="delete-button" onClick={() => handleDelete(item.id)}>
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="add-item">
      {/* Campos de entrada para adicionar um novo item */}
      <input
        type="text"
        name="nome"
        value={newItem.nome}
        onChange={handleChange}
        placeholder="Nome"
      />
      <input
        type="text"
        name="quantidade"
        value={newItem.quantidade}
        onChange={handleChange}
        placeholder="Quantidade"
      />
      <input
        type="text"
        name="valor"
        value={newItem.valor}
        onChange={handleChange}
        placeholder="Valor"
      />
      {/* Botão para adicionar o novo item */}
      <button className="add-button" onClick={handleAdd}>
        <FaPlus />
      </button>
    </div>
  </div>
);

}

export default App;

