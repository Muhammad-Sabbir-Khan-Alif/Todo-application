import React, { useState, useEffect } from "react";
import './index.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaTrash, FaEdit } from 'react-icons/fa';

function App() {
  const [texts, setTexts] = useState('');
  const [items, setItems] = useState([]);
  const [editedItemIds, setEditedItemIds] = useState([]);
  const [ifEdit, setIfEdit] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items'));
    if (savedItems) {
      setItems(savedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const handleChange = (event) => {
    setTexts(event.target.value)
  }

  const handleDone = () => {
    if (texts === "") {
      toast.error('Enter your task first!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        hideProgressBar: false,
      });
    }

    const item = {
      id: Math.random() * 1000,
      value: texts
    }

    setItems((oldItems) => [...oldItems, item])
    setTexts('');
  }

  const handleComplete = (itemId) => {
    if (editedItemIds.includes(itemId)) {
      setEditedItemIds(editedItemIds.filter(id => id !== itemId));
    } else {
      setEditedItemIds([...editedItemIds, itemId]);
    }
  }

  const handleDelete = (demo) => {
    setItems(items.filter(item => item.id !== demo));
  }

  const handleEdit = (itemId) => {
    setEditingItemId(itemId);
    setIfEdit(!ifEdit);
    setEditedValue(items.find(item => item.id === itemId)?.value || '');
  }

  const handleEditedValue = (event) => {
    setEditedValue(event.target.value);
  }

  const handleSaveEdit = () => {
    setItems(items.map(item => {
      if (item.id === editingItemId) {
        return { ...item, value: editedValue };
      }
      return item;
    }));
    setEditingItemId(null);
    setIfEdit(false);
  }

  return (
    <div className="main-div">
      <div className="mid-div">
        <div>
          <h4 className="main-heading">Todo - List</h4>
        </div>
        <div className="devider-div"></div>
        <div className="input-div">
          <input type="text" name="text" id="text" className="input" placeholder="Add anything you want..." value={texts} onChange={handleChange} />
          <button className="done-button" onClick={handleDone} disabled={texts === '' && true}>Done!</button>
        </div>
        <div className="output-div">
          {items.map((imp) => {
            const isEdited = editedItemIds.includes(imp.id);
            const isBeingEdited = imp.id === editingItemId;

            return (
              <div key={imp.id}>
                {isBeingEdited ? (
                  <div>
                    <input value={editedValue} onChange={handleEditedValue} placeholder="Re-enter your task..." className="retask-inp" />
                    <button onClick={handleSaveEdit} className="save-btn">Save</button>
                  </div>
                ) : (
                  <h6 className={isEdited ? 'output-edited' : 'output'}>{imp.value}</h6>
                )}
                <div className="btn-div">
                  <button className="complete-btn" onClick={() => handleComplete(imp.id)}><FaCheckCircle /></button>
                  <button className="delete-btn" onClick={() => handleDelete(imp.id)}><FaTrash /></button>
                  <button className="edit-btn" onClick={() => handleEdit(imp.id)}><FaEdit /></button>
                </div>
                <div className="devider-div"></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
