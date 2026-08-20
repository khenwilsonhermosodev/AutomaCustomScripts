function kwh_get_elem({ arr_iframe_seq, str_selector }) {
  try {
    let ctx = document;

    if (arr_iframe_seq?.length) {
      for (const iframeSelector of arr_iframe_seq) {
        const iframe = ctx.querySelector(iframeSelector);

        if (!iframe) {
          console.error("Iframe not found:", iframeSelector);
          return null;
        }

        ctx = iframe.contentDocument ||
          iframe.contentWindow?.document;
      }
    }

    return ctx.querySelector(str_selector);

  } catch (e) {
    console.error("kwh_get_elem error:", e);
    return null;
  }
}

function kwh_notify({
  str_message = "",
  str_color = "primary"
} = {}) {

  const colors = {
    primary: { bg: "#0d6efd", text: "#ffffff" },
    secondary: { bg: "#6c757d", text: "#ffffff" },
    success: { bg: "#198754", text: "#ffffff" },
    danger: { bg: "#dc3545", text: "#ffffff" },
    warning: { bg: "#ffc107", text: "#000000" },
    info: { bg: "#0dcaf0", text: "#000000" },
    light: { bg: "#f8f9fa", text: "#000000" },
    dark: { bg: "#212529", text: "#ffffff" }
  };

  let popup = document.getElementById("kwh-notification-window");

  if (!popup) {

    popup = document.createElement("div");
    popup.id = "kwh-notification-window";

    popup.innerHTML = `
      <div id="kwh-notification-header">
        <span>Notifications</span>
        <div>
          <button id="kwh-notification-clear">Clear</button>
          <button id="kwh-notification-close">✕</button>
        </div>
      </div>
      <div id="kwh-notification-body"></div>
    `;

    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 450px;
      height: 300px;
      background: #212529;
      border: 1px solid #495057;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,.4);
      z-index: 99999;
      resize: both;
      overflow: hidden;
      min-width: 300px;
      min-height: 150px;
      font-family: Arial, sans-serif;
      color: white;
    `;

    document.body.appendChild(popup);

    const header = popup.querySelector("#kwh-notification-header");
    header.style.cssText = `
      background: #343a40;
      color: white;
      padding: 8px 12px;
      cursor: move;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      border-bottom: 1px solid #495057;
    `;

    const body = popup.querySelector("#kwh-notification-body");
    body.style.cssText = `
      background: #212529;
      padding: 10px;
      height: calc(100% - 43px);
      overflow-y: auto;
      box-sizing: border-box;
    `;

    popup.querySelectorAll("button").forEach(btn => {
      btn.style.cssText = `
        margin-left: 5px;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
      `;
    });

    popup.querySelector("#kwh-notification-clear").onclick = () => {
      body.innerHTML = "";
    };

    popup.querySelector("#kwh-notification-close").onclick = () => {
      popup.remove();
    };

    // Dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", e => {
      isDragging = true;
      offsetX = e.clientX - popup.offsetLeft;
      offsetY = e.clientY - popup.offsetTop;
    });

    document.addEventListener("mousemove", e => {
      if (!isDragging) return;

      popup.style.left = `${e.clientX - offsetX}px`;
      popup.style.top = `${e.clientY - offsetY}px`;
      popup.style.right = "auto";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  const body = popup.querySelector("#kwh-notification-body");
  const theme = colors[str_color] || colors.primary;

  const line = document.createElement("div");

  line.textContent =
    `[${new Date().toLocaleTimeString()}] ${str_message}`;

  line.style.cssText = `
    background: ${theme.bg};
    color: ${theme.text};
    padding: 8px 10px;
    margin-bottom: 6px;
    border-radius: 4px;
    font-size: 13px;
    word-break: break-word;
  `;

  body.appendChild(line);

  body.scrollTop = body.scrollHeight;
}
