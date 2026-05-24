import { FormEvent, StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Agentation } from 'agentation';
import './styles.css';

type ReviewDocument = {
  path: string;
  title: string;
  renderedHtml: string;
};

type ReviewResponse = {
  path?: string;
  html?: string;
  error?: string;
};

const sampleReportPath =
  'C:\\Users\\USER1\\Desktop\\Study\\wsop-web-automation\\automation\\output\\wsop-public-smoke-latest-report-ko.html';

function App() {
  const [lastCopiedPrompt, setLastCopiedPrompt] = useState('');

  return (
    <StrictMode>
      <HtmlReviewExperience lastCopiedPrompt={lastCopiedPrompt} />
      <Agentation onCopy={(markdown) => setLastCopiedPrompt(markdown)} />
    </StrictMode>
  );
}

function HtmlReviewExperience({ lastCopiedPrompt }: { lastCopiedPrompt: string }) {
  const initialFile = useMemo(() => new URLSearchParams(window.location.search).get('file') || '', []);
  const [filePath, setFilePath] = useState(initialFile);
  const [reviewDocument, setReviewDocument] = useState<ReviewDocument | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialFile) {
      void loadHtml(initialFile);
    }
  }, [initialFile]);

  async function loadHtml(pathToLoad = filePath) {
    const trimmedPath = pathToLoad.trim();
    if (!trimmedPath) {
      setStatusMessage('검토할 HTML 파일 경로를 입력하세요.');
      return;
    }

    setIsLoading(true);
    setStatusMessage('HTML 파일을 불러오는 중입니다...');

    try {
      const response = await fetch(`/__html-review?path=${encodeURIComponent(trimmedPath)}`);
      const data = (await response.json()) as ReviewResponse;

      if (!response.ok || !data.html || !data.path) {
        throw new Error(data.error || 'HTML 파일을 불러오지 못했습니다.');
      }

      const parsed = parseHtmlForReview(data.html);
      setReviewDocument({
        path: data.path,
        title: parsed.title,
        renderedHtml: parsed.renderedHtml,
      });
      setStatusMessage('HTML을 불러왔습니다. 우측 하단 Agentation 버튼으로 원하는 요소를 선택하세요.');
      window.history.replaceState(null, '', `/?file=${encodeURIComponent(data.path)}`);
    } catch (error) {
      setReviewDocument(null);
      setStatusMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadHtml();
  }

  return (
    <>
      <aside className="agd-review-toolbar">
        <div>
          <p className="agd-eyebrow">Agentation HTML Review</p>
          <h1>로컬 HTML 파일을 열고 화면 위에 피드백 남기기</h1>
        </div>

        <form className="agd-path-form" onSubmit={handleSubmit}>
          <input
            value={filePath}
            onChange={(event) => setFilePath(event.target.value)}
            placeholder={sampleReportPath}
            aria-label="검토할 HTML 파일 경로"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? '불러오는 중' : 'HTML 열기'}
          </button>
        </form>

        <div className="agd-toolbar-actions">
          <button type="button" onClick={() => setFilePath(sampleReportPath)}>
            WSOP 한글 리포트 경로 넣기
          </button>
          <span>{statusMessage || 'HTML 경로를 입력하거나 샘플 데모 영역을 사용하세요.'}</span>
        </div>

        {lastCopiedPrompt && (
          <details className="agd-prompt-preview" open>
            <summary>마지막 복사된 프롬프트 보기</summary>
            <textarea value={lastCopiedPrompt} readOnly />
          </details>
        )}
      </aside>

      {reviewDocument ? (
        <main className="agd-html-review">
          <div className="agd-loaded-file">
            <strong>{reviewDocument.title}</strong>
            <span>{reviewDocument.path}</span>
          </div>
          <article
            className="agd-rendered-html"
            dangerouslySetInnerHTML={{ __html: reviewDocument.renderedHtml }}
          />
        </main>
      ) : (
        <DemoExperience />
      )}
    </>
  );
}

function DemoExperience() {
  return (
    <main className="agd-app-shell">
      <section className="agd-hero">
        <div>
          <p className="agd-eyebrow">Agentation Demo</p>
          <h2>AI 에이전트에게 화면 피드백을 정확히 전달하기</h2>
          <p className="agd-lede">
            우측 하단의 Agentation 버튼을 눌러 화면 요소를 클릭하고, 주석을 달고,
            생성된 구조화 피드백을 복사해보세요.
          </p>
        </div>
        <button className="agd-primary-action">샘플 액션</button>
      </section>

      <section className="agd-workspace-grid" aria-label="샘플 피드백 영역">
        <article className="agd-panel">
          <div className="agd-panel-header">
            <span className="agd-status-dot" />
            <h3>리포트 요약 카드</h3>
          </div>
          <p>
            이 카드의 제목, 문장, 상태 표시 같은 요소를 클릭해서 Agentation이 어떤
            selector와 맥락을 잡는지 확인할 수 있습니다.
          </p>
          <div className="agd-metric-row">
            <div>
              <span className="agd-metric-label">통과</span>
              <strong>22</strong>
            </div>
            <div>
              <span className="agd-metric-label">주의</span>
              <strong>1</strong>
            </div>
            <div>
              <span className="agd-metric-label">실패</span>
              <strong>0</strong>
            </div>
          </div>
        </article>

        <article className="agd-panel">
          <div className="agd-panel-header">
            <span className="agd-status-dot agd-amber" />
            <h3>피드백 대상 폼</h3>
          </div>
          <label>
            리포트 이름
            <input value="WSOP 공개 웹 Smoke 리포트" readOnly />
          </label>
          <label>
            개선 메모
            <textarea value="이 영역을 클릭해 개선 의견을 남겨보세요." readOnly />
          </label>
        </article>

        <article className="agd-panel agd-wide">
          <div className="agd-panel-header">
            <span className="agd-status-dot agd-red" />
            <h3>검증 항목 테이블</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>영역</th>
                <th>목적</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Public Pages</td>
                <td>주요 공개 페이지 로딩 확인</td>
                <td>통과</td>
              </tr>
              <tr>
                <td>Navigation</td>
                <td>상단 메뉴 노출 및 이동 확인</td>
                <td>주의</td>
              </tr>
              <tr>
                <td>Links</td>
                <td>내부 링크 샘플 상태 확인</td>
                <td>통과</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>
    </main>
  );
}

function parseHtmlForReview(html: string) {
  const documentFragment = new DOMParser().parseFromString(html, 'text/html');
  const title = documentFragment.querySelector('title')?.textContent?.trim() || 'HTML Review';
  const styles = [...documentFragment.head.querySelectorAll('style, link[rel="stylesheet"]')]
    .map((node) => node.outerHTML)
    .join('\n');

  return {
    title,
    renderedHtml: `${styles}\n${documentFragment.body.innerHTML}`,
  };
}

createRoot(document.getElementById('root')!).render(<App />);
