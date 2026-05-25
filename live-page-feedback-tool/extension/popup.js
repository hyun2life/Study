document.addEventListener('DOMContentLoaded', async () => {
  const activateBtn = document.getElementById('activate-btn');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.id) return;

  // 1. 이미 스크립트가 주입되어 활성화 상태인지 확인
  let isLoaded = false;
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: "PING" });
    if (response && response.status === "PONG") {
      isLoaded = true;
    }
  } catch (err) {
    // 로드 안 된 상태
  }

  // 2. 로드 상태에 맞춰 UI 문구 및 색상 조정
  if (isLoaded) {
    activateBtn.innerText = "피드백 모드 끄기";
    activateBtn.style.backgroundColor = "#ef4444"; // 빨간색 테마
    activateBtn.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.25)";
  }

  // 3. 버튼 클릭 핸들러
  activateBtn.addEventListener('click', async () => {
    if (isLoaded) {
      // 끄는 동작 수행
      try {
        await chrome.tabs.sendMessage(tab.id, { action: "UNMOUNT_FEEDBACK" });
      } catch (e) {
        console.error("UNMOUNT_FEEDBACK 전송 실패:", e);
      }
      window.close();
    } else {
      // 켜는(주입) 동작 수행
      try {
        // 빌드된 content.js 주입
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });

        // 주입 완료 후 명시적 시작 명령 전송
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(tab.id, { action: "START_FEEDBACK" });
          } catch (e) {
            console.error("START_FEEDBACK 전송 실패:", e);
          }
        }, 150);

        window.close();
      } catch (err) {
        console.error("스크립트/스타일 주입 실패:", err);
        alert(
          "이 페이지에서는 피드백 모드를 켤 수 없습니다.\n" +
          "이유: chrome:// 페이지, Chrome 웹스토어 또는 브라우저 보안에 의해 제한된 페이지입니다.\n" +
          "일반 웹사이트(http/https)나 로컬 웹서버(localhost)에서 다시 시도해 주세요."
        );
      }
    }
  });

  // 4. 가이드 아코디언 토글 핸들러
  const guideToggleBtn = document.getElementById('guide-toggle-btn');
  const guideWrapper = document.getElementById('guide-wrapper');
  
  if (guideToggleBtn && guideWrapper) {
    guideToggleBtn.addEventListener('click', () => {
      guideWrapper.classList.toggle('active');
    });
  }
});
