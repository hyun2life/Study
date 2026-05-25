import { createRoot, Root } from 'react-dom/client';
import { Agentation } from 'agentation';

declare global {
  interface Window {
    __agdExtensionRoot?: Root;
    __agdExtensionContainer?: HTMLDivElement;
    __agdExtensionUnmount?: () => void;
  }
}

function mountAgentation() {
  const rootId = 'agentation-extension-root';
  let container = document.getElementById(rootId) as HTMLDivElement | null;

  if (container) {
    console.log('[Agentation Extension] Already mounted.');
    return;
  }

  // 루트 컨테이너 엘리먼트 생성
  container = document.createElement('div');
  container.id = rootId;
  container.style.position = 'relative';
  container.style.zIndex = '9999999';
  document.body.appendChild(container);

  // 리액트 마운트 실행
  const root = createRoot(container);
  root.render(<Agentation />);

  // 클린업 및 언마운트를 위한 핸들러 보관
  window.__agdExtensionRoot = root;
  window.__agdExtensionContainer = container;
  window.__agdExtensionUnmount = () => {
    root.unmount();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    delete window.__agdExtensionRoot;
    delete window.__agdExtensionContainer;
    delete window.__agdExtensionUnmount;
    console.log('[Agentation Extension] Unmounted successfully.');
  };
  
  console.log('[Agentation Extension] Mounted successfully.');
}

function init() {
  // 스크립트가 처음 주입될 때 자동으로 마운트 처리
  mountAgentation();

  // 팝업과의 통신을 위해 메시지 리스너 등록
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "PING") {
      sendResponse({ status: "PONG" });
    } else if (message.action === "UNMOUNT_FEEDBACK") {
      if (window.__agdExtensionUnmount) {
        window.__agdExtensionUnmount();
      }
      sendResponse({ status: "UNMOUNTED" });
    } else if (message.action === "START_FEEDBACK") {
      mountAgentation();
      sendResponse({ status: "MOUNTED" });
    }
    return true;
  });
}

// 초기화 시작
init();
