import { queueSpeech } from "../lib/speechQueue";

let cancelCurrentSpeech: (() => void) | null = null;

async function clippy() {
  const pageText = document.body.innerText;
  const pageTitle = document.title;

  const messages = [
    {
      role: "system",
      content:
        "You are Clippy, the enthusiastic and overeager digital assistant! Your personality is helpful, cheerful, and slightly quirky. You love to pop up with interesting facts and observations, always starting with 'Hi there! Looks like you're reading about...' or 'Hey! I noticed that...'. Keep your responses short, fun, and engaging. End your messages with an offer to help, like 'Need any help understanding this?' or 'Would you like to know more about that?' Never use emojis, ever.",
    },
    {
      role: "user",
      content: `Analyze this webpage\'s content and tell me a completely useless fact about it in your Clippy style, but don't mention that it's uselss. Keep the facts 2 sentences. Here\'s the title: "${pageTitle}" and a sample of the text content: "${pageText.slice(
        0,
        500
      )}..."`,
    },
  ];

  try {
    // Call Hack Club AI API
    const response = await fetch("https://ai.hackclub.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const fact = data.choices[0].message.content;

    console.log("📎 Clippy says:", fact);

    const shadowHost = document.createElement("div");
    shadowHost.style.position = "fixed";
    shadowHost.style.bottom = "20px";
    shadowHost.style.right = "20px";
    shadowHost.style.zIndex = "2147483647";
    shadowHost.style.transition = "top 0.5s ease-in-out, left 0.5s ease-in-out";
    document.body.appendChild(shadowHost);

    const shadowRoot = shadowHost.attachShadow({ mode: "open" });

    const clippyContainer = document.createElement("div");
    clippyContainer.style.all = "initial";
    clippyContainer.style.display = "flex";
    clippyContainer.style.flexDirection = "column";
    clippyContainer.style.alignItems = "center";
    clippyContainer.style.fontFamily =
      "'Helvetica Neue', Helvetica, Arial, sans-serif";
    clippyContainer.style.fontSize = "14px";
    clippyContainer.style.lineHeight = "1.4";
    clippyContainer.style.color = "#333333";

    const speechBubble = document.createElement("div");
    speechBubble.textContent = fact;
    speechBubble.style.backgroundColor = "#fcffc8";
    speechBubble.style.border = "1px solid black";
    speechBubble.style.borderRadius = "10px";
    speechBubble.style.padding = "15px";
    speechBubble.style.marginBottom = "10px";
    speechBubble.style.maxWidth = "300px";
    speechBubble.style.boxShadow = "5px 5px 10px rgba(0,0,0,0.2)";
    speechBubble.style.position = "relative";

    const closeButton = document.createElement("div");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "10px";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.fontWeight = "bold";
    closeButton.style.lineHeight = "1";
    closeButton.style.padding = "2px 5px";
    closeButton.style.border = "1px solid black";
    closeButton.style.borderRadius = "50%";
    closeButton.style.backgroundColor = "#fcffc8";

    const originalOnClose = () => {
      shadowHost.remove();
    };
    closeButton.onclick = originalOnClose;

    speechBubble.appendChild(closeButton);

    const bubbleTail = document.createElement("div");
    bubbleTail.style.width = "0";
    bubbleTail.style.height = "0";
    bubbleTail.style.borderLeft = "10px solid transparent";
    bubbleTail.style.borderRight = "10px solid transparent";
    bubbleTail.style.borderTop = "10px solid #fcffc8";
    bubbleTail.style.position = "absolute";
    bubbleTail.style.bottom = "-10px";
    bubbleTail.style.left = "calc(50% - 10px)";
    const tailBorder = document.createElement("div");
    tailBorder.style.width = "0";
    tailBorder.style.height = "0";
    tailBorder.style.borderLeft = "11px solid transparent";
    tailBorder.style.borderRight = "11px solid transparent";
    tailBorder.style.borderTop = "11px solid black";
    tailBorder.style.position = "absolute";
    tailBorder.style.bottom = "-11px";
    tailBorder.style.left = "calc(50% - 11px)";
    tailBorder.style.zIndex = "-1";

    speechBubble.appendChild(tailBorder);
    speechBubble.appendChild(bubbleTail);

    const clippyImage = document.createElement("img");
    clippyImage.src = "https://files.catbox.moe/m1dw07.gif";
    clippyImage.alt = "Clippy";
    clippyImage.style.width = "80px";
    clippyImage.style.height = "auto";

    clippyContainer.appendChild(speechBubble);
    clippyContainer.appendChild(clippyImage);
    shadowRoot.appendChild(clippyContainer);

    const styleElement = document.createElement("style");
    styleElement.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .clippy-speech-bubble {
          background-color: #fcffc8;
          border: 1px solid black;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 10px;
          max-width: 300px;
          box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
          position: relative;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Explicit font stack */
          font-size: 1em; /* Relative to clippyContainer's 14px */
          line-height: 1.5;
          color: black; /* Specific text color for the bubble content */
        }
        .clippy-speech-bubble-tail {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #fcffc8;
          position: absolute;
          bottom: -10px;
          left: calc(50% - 10px);
        }
        .clippy-speech-bubble-tail-border {
          width: 0;
          height: 0;
          border-left: 11px solid transparent;
          border-right: 11px solid transparent;
          border-top: 11px solid black;
          position: absolute;
          bottom: -11px;
          left: calc(50% - 11px)";
          z-index: -1;
        }
        .clippy-close-button {
          position: absolute;
          top: 5px;
          right: 10px;
          cursor: pointer;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Consistent font */
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
          padding: 2px 5px;
          border: 1px solid black;
          border-radius: 50%;
          background-color: #fcffc8;
          color: black; /* Explicit color for the 'X' */
        }
        .clippy-image {
          width: 80px;
          height: auto;
        }
      `;
    shadowRoot.appendChild(styleElement);

    speechBubble.className = "clippy-speech-bubble";
    speechBubble.textContent = fact;

    bubbleTail.className = "clippy-speech-bubble-tail";
    tailBorder.className = "clippy-speech-bubble-tail-border";
    closeButton.className = "clippy-close-button";
    closeButton.textContent = "X";

    clippyImage.className = "clippy-image";
    clippyImage.src = "https://files.catbox.moe/m1dw07.gif";
    clippyImage.alt = "Clippy";

    speechBubble.appendChild(tailBorder);
    speechBubble.appendChild(bubbleTail);
    speechBubble.appendChild(closeButton);

    cancelCurrentSpeech = queueSpeech(fact);

    const moveClippyRandomly = () => {
      if (!shadowHost.isConnected) {
        clearInterval(moveInterval);
        return;
      }

      const clippyWidth = shadowHost.offsetWidth;
      const clippyHeight = shadowHost.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newTop = Math.random() * (viewportHeight - clippyHeight);
      let newLeft = Math.random() * (viewportWidth - clippyWidth);

      newTop = Math.max(0, Math.min(newTop, viewportHeight - clippyHeight));
      newLeft = Math.max(0, Math.min(newLeft, viewportWidth - clippyWidth));

      shadowHost.style.top = `${newTop}px`;
      shadowHost.style.left = `${newLeft}px`;
      shadowHost.style.bottom = "auto";
      shadowHost.style.right = "auto";
    };

    const moveInterval = setInterval(moveClippyRandomly, 3000);
    setTimeout(moveClippyRandomly, 100);

    const existingCloseHandler = closeButton.onclick;
    closeButton.onclick = (event) => {
      clearInterval(moveInterval);
      speechSynthesis.cancel();
      if (cancelCurrentSpeech) {
        cancelCurrentSpeech();
        cancelCurrentSpeech = null;
      }
      if (existingCloseHandler) {
        existingCloseHandler.call(closeButton, event as any);
      }
    };
  } catch (error) {
    console.error("Error analyzing page:", error);
    if (cancelCurrentSpeech) {
      cancelCurrentSpeech();
      cancelCurrentSpeech = null;
    }
    const existingShadowHost = document.querySelector(
      'div[style*="zIndex: 2147483647"]'
    );
    if (existingShadowHost) {
      existingShadowHost.remove();
    }
  }
}

export default defineContentScript({
  matches: ["<all_urls>"],
  async main(ctx) {
    const handleLocationChange = async () => {
      speechSynthesis.cancel();

      if (cancelCurrentSpeech) {
        cancelCurrentSpeech();
        cancelCurrentSpeech = null;
      }

      await clippy();
    };

    ctx.addEventListener(window, "wxt:locationchange", handleLocationChange);
    await clippy();
  },
});
