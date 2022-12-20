import { useEffect, useState } from "react";
import { writeText } from '@tauri-apps/api/clipboard';
import { appWindow } from '@tauri-apps/api/window';
import "./style.css";
import { ClipboardCache } from "../../utils/cache";

const { list } = new ClipboardCache();

export default function Clipboard() {

  // 关闭窗口
  useEffect(() => {
    let unlisten = () => {};
    (async () => {
      unlisten = await appWindow.onFocusChanged((e) => {
        if (!e.payload) {
          appWindow.close();
        }
      });
    })();
    return () => unlisten();
  }, []);

  async function handleClick(item) {
    await writeText(item.content);
    appWindow.close();
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
