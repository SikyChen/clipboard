import { useEffect } from "react";
import { register, unregisterAll } from '@tauri-apps/api/globalShortcut';
import { appWindow } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/window';
import { readText } from "@tauri-apps/api/clipboard";
import "./App.css";
import { uniqeId } from "./utils/tools";
import { ClipboardCache } from "./utils/cache";

const { getList: getCacheList, setList: setCacheList } = new ClipboardCache();

let labelName = uniqeId('clipboard');

function App() {

  // 自动隐藏窗口
  useEffect(() => {
    let unlisten = () => {};
    (async () => {
      unlisten = await appWindow.onFocusChanged(async (e) => {
        if (!e.payload) {
          await appWindow.hide();
          await appWindow.minimize();
        }
      });
    })();
    return () => unlisten();
  }, []);

  // 监听快捷键，自动弹出窗口
  useEffect(() => {
    (async () => {
      await register('Command+Option+V', async () => {
        handleOpenClipboardWindow();
      });
    })();
    return () => {
      unregisterAll();
    }
  }, []);

  // 收集复制的内容
  useEffect(() => {
    const timer = setInterval(updateClipboard, 1000);
    return () => clearInterval(timer);
  }, []);

  async function updateClipboard() {
    const clipboardText = await readText();
    const cacheList = getCacheList();

    if (clipboardText === cacheList[0]?.content) { return; }

    const repeatItem = cacheList.find(item => item.content === clipboardText);
    const newItem = {
      type: "text",
      content: clipboardText,
      id: new Date().getTime(),
    }

    let newList = [newItem];

    if (repeatItem) {
      newList = newList.concat(cacheList.filter(item => item.id !== repeatItem.id));
    }
    else {
      newList = newList.concat(cacheList);
    }

    if (newList.length > 30) {
      newList = newList.slice(0, 30);
    }

    setCacheList(newList);
  }

  async function handleOpenClipboardWindow() {
    labelName = uniqeId('clipboard');
    const clipboardWindow = new WebviewWindow(labelName, {
      "url": "/clipboard",
      "decorations": false,
      "width": 500,
      "height": 600,
      "resizable": false,
      "transparent": true
    });
    setTimeout(() => {
      clipboardWindow.setFocus();
    }, 500);
  }

  return (
    <div className="container">
      <h1>CLIPBOARD</h1>
      <p>使用 option + commond + V 查看剪贴板历史记录</p>
    </div>
  );
}

export default App;
