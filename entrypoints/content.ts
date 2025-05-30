import { queueSpeech } from "../lib/speechQueue";

let speechQueued = false;
let speechText = "";
function playSpeech() {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(speechText);
    speechSynthesis.speak(utterance);
  }
}

function handleUserInteraction() {
  if (speechQueued) {
    playSpeech();
    speechQueued = false;
    // Remove listeners after first interaction
    document.removeEventListener("click", handleUserInteraction);
    document.removeEventListener("keydown", handleUserInteraction);
    document.removeEventListener("scroll", handleUserInteraction);
  }
}

// Queue speech for first user interaction
speechQueued = true;
document.addEventListener("click", handleUserInteraction);
document.addEventListener("keydown", handleUserInteraction);
document.addEventListener("scroll", handleUserInteraction);

export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    // Get page text content and title
    const pageText = document.body.innerText;
    const pageTitle = document.title;

    // Prepare prompt for the AI
    const messages = [
      {
        role: "system",
        content:
          "You are Clippy, the enthusiastic and sometimes overeager digital assistant! Your personality is helpful, cheerful, and slightly quirky. You love to pop up with interesting facts and observations, always starting with 'Hi there! Looks like you're reading about...' or 'Hey! I noticed that...'. Keep your responses short, fun, and engaging. End your messages with an offer to help, like 'Need any help understanding this?' or 'Would you like to know more about that?' Never use emojis, ever.",
      },
      {
        role: "user",
        content: `Analyze this webpage's content and tell me an interesting fact about it in your Clippy style. Keep the facts short and snappy. Here's the title: "${pageTitle}" and a sample of the text content: "${pageText.slice(
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

      // Create a host element for the shadow DOM
      const shadowHost = document.createElement("div");
      shadowHost.style.position = "fixed";
      shadowHost.style.bottom = "20px";
      shadowHost.style.right = "20px";
      shadowHost.style.zIndex = "2147483647"; // Max z-index
      document.body.appendChild(shadowHost);

      // Attach a shadow root
      const shadowRoot = shadowHost.attachShadow({ mode: "open" });

      // Create Clippy container (will be inside the shadow DOM)
      const clippyContainer = document.createElement("div");
      // Reset styles and set a baseline for the container itself
      clippyContainer.style.all = "initial";
      clippyContainer.style.display = "flex";
      clippyContainer.style.flexDirection = "column";
      clippyContainer.style.alignItems = "center";
      // Establish a new default font context within the shadow DOM
      clippyContainer.style.fontFamily =
        "'Helvetica Neue', Helvetica, Arial, sans-serif";
      clippyContainer.style.fontSize = "14px";
      clippyContainer.style.lineHeight = "1.4";
      clippyContainer.style.color = "#333333"; // A neutral dark gray for text

      // Create speech bubble
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

      // Create Close button
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
      closeButton.style.backgroundColor = "#fcffc8"; // Match bubble background

      closeButton.onclick = () => {
        shadowHost.remove(); // Remove the host, which removes the shadow DOM
      };

      speechBubble.appendChild(closeButton);

      // Add a little tail to the bubble
      const bubbleTail = document.createElement("div");
      bubbleTail.style.width = "0";
      bubbleTail.style.height = "0";
      bubbleTail.style.borderLeft = "10px solid transparent";
      bubbleTail.style.borderRight = "10px solid transparent";
      bubbleTail.style.borderTop = "10px solid #fcffc8"; // Same as bubble background
      bubbleTail.style.position = "absolute";
      bubbleTail.style.bottom = "-10px"; // Position the tail at the bottom of the bubble
      bubbleTail.style.left = "calc(50% - 10px)"; // Center the tail
      // Add a border to the tail
      const tailBorder = document.createElement("div");
      tailBorder.style.width = "0";
      tailBorder.style.height = "0";
      tailBorder.style.borderLeft = "11px solid transparent"; // Slightly larger for border
      tailBorder.style.borderRight = "11px solid transparent"; // Slightly larger for border
      tailBorder.style.borderTop = "11px solid black"; // Border color
      tailBorder.style.position = "absolute";
      tailBorder.style.bottom = "-11px"; // Position border behind tail
      tailBorder.style.left = "calc(50% - 11px)";
      tailBorder.style.zIndex = "-1"; // Place border behind tail fill

      speechBubble.appendChild(tailBorder);
      speechBubble.appendChild(bubbleTail);

      // Create Clippy image
      const clippyImage = document.createElement("img");
      clippyImage.src = "https://files.catbox.moe/m1dw07.gif";
      clippyImage.alt = "Clippy";
      clippyImage.style.width = "80px"; // Adjust size as needed
      clippyImage.style.height = "auto";

      // Append elements to the shadow root
      clippyContainer.appendChild(speechBubble);
      clippyContainer.appendChild(clippyImage);
      shadowRoot.appendChild(clippyContainer);

      // Add styles to the shadow DOM
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

      // Apply classes instead of inline styles for elements within shadow DOM
      speechBubble.className = "clippy-speech-bubble";
      speechBubble.textContent = fact; // Set text content after class name to avoid overwrite if styles affect content

      bubbleTail.className = "clippy-speech-bubble-tail";
      tailBorder.className = "clippy-speech-bubble-tail-border";
      closeButton.className = "clippy-close-button";
      closeButton.textContent = "X"; // Re-set text content as it might be cleared by className

      clippyImage.className = "clippy-image";
      clippyImage.src = "https://files.catbox.moe/m1dw07.gif";
      clippyImage.alt = "Clippy";

      // Re-append close button and tail as their content might have been affected by className changes
      speechBubble.appendChild(tailBorder);
      speechBubble.appendChild(bubbleTail);
      speechBubble.appendChild(closeButton);

      queueSpeech(fact);
    } catch (error) {
      console.error("Error analyzing page:", error);
    }
  },
});
