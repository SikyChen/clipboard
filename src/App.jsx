import { useEffect, useState } from "react";
import "./App.css";
import { readText, writeText } from '@tauri-apps/api/clipboard';

const storageList = localStorage.getItem('clipboard-list');

function App() {
  const [list, setList] = useState(storageList ? JSON.parse(storageList) : []);

  useEffect(() => {
    const timer = setInterval(updateClipboard, 1000);
    return () => clearInterval(timer);
  })

  async function updateClipboard() {
    const clipboardText = await readText();
    const repeatItem = list.find(item => item.content === clipboardText);
    const newItem = {
      type: "text",
      content: clipboardText,
      id: new Date().getTime(),
    }

    let newList = [newItem];

    if (repeatItem) {
      newList = newList.concat(list.filter(item => item.id !== repeatItem.id));
    }
    else {
      newList = newList.concat(list);
    }

    setList(newList);
    localStorage.setItem('clipboard-list', JSON.stringify(newList));
  }

  async function handleClick(item) {
    await writeText(item.content);
    updateClipboard();
  }

  return (
    <div className="container">
      <h1 className="title">CLIPBOARD</h1>

      <div className="list">
        {
          list.map((item, index) => (
            <div key={item.id} className="list-item" onClick={() => handleClick(item)}>
              {item.content}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
