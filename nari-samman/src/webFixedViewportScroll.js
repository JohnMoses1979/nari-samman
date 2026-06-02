// FINAL FIX: single scroll container for Expo Web.
// No wheel listener. No manual scroll. No double body/root scroll.
if (typeof document !== "undefined") {
  const oldTags = document.querySelectorAll("[data-nari-scroll-fix]");
  oldTags.forEach((tag) => tag.remove());

  const style = document.createElement("style");
  style.setAttribute("data-nari-scroll-fix", "fixed-viewport");
  style.innerHTML = `
    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      overflow: hidden !important;
      position: fixed !important;
      inset: 0 !important;
      overscroll-behavior: none !important;
      scroll-behavior: auto !important;
    }

    #root {
      width: 100% !important;
      height: 100vh !important;
      overflow: hidden !important;
      position: fixed !important;
      inset: 0 !important;
      background: #0d1826 !important;
    }

    #root > div {
      width: 100% !important;
      height: 100vh !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      position: relative !important;
      overscroll-behavior-y: contain !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-gutter: stable !important;
      scroll-behavior: auto !important;
    }

    * {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(style);
}
