import { useEffect, useRef, useState } from "react";
import { writeText } from '@tauri-apps/api/clipboard';
import { appWindow } from '@tauri-apps/api/window';
// import { invoke } from '@tauri-apps/api/tauri'
import "./style.css";
import { ClipboardCache } from "../../utils/cache";

const { getList } = new ClipboardCache();

export default function Clipboard() {

  const listRef = useRef(getList());

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);

  const updateSelected = (val) => {
    if (val < 0) val = 0;
    if (val >= listRef.current.length) val = listRef.current.length - 1;
    currentIndexRef.current = val;
    setCurrentIndex(val);
  }

  // const handleClose = async () => {
  //   await appWindow.close();
  //   // await invoke('focus_previous_window');
  // }

  async function handleSelect(item) {
    await writeText(item.content);
    appWindow.close();
  }

  // 关闭窗口
  useEffect(() => {
    let unlisten = () => {};
    (async () => {
      unlisten = await appWindow.onFocusChanged((e) => {
        if (!e.payload) {
          // appWindow.close();
        }
      });
    })();
    return () => unlisten();
  }, []);

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      appWindow.close();
    }
    // 如果是上下键，则切换当前选中项
    else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      updateSelected(currentIndexRef.current + (e.key === 'ArrowUp' ? -1 : 1));
      const currentDom = document.querySelector(`.list-item-${currentIndexRef.current}`);
      console.log(currentDom.offsetTop);
      if (currentDom.offsetTop > 300) {
        document.querySelector('.list').scrollTop = Math.max(currentDom.offsetTop - 300, 0);
      } else {
        document.querySelector('.list').scrollTop = 0;
      }
    }
    // 如果是 enter 键，则复制当前选中项
    else if (e.key === 'Enter') {
      handleSelect(listRef.current[currentIndexRef.current]);
    }
  }

  // 监听键盘事件
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="container">
      <h1 className="title">CLIPBOARD</h1>

      <div className="content">
        <div className="list">
          {
            listRef.current.map((item, index) => (
              <div
                key={item.id}
                className={`list-item list-item-${index} ${index === currentIndex ? 'list-item-hover' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => updateSelected(index)}
              >
                {item.content}
              </div>
            ))
          }
        </div>
        <div className="detail">
          <textarea value={listRef.current[currentIndex]?.content} disabled></textarea>
        </div>
      </div>
    </div>
  );
}
