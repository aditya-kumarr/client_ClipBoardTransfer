const text = document.getElementById("text");
const form = document.querySelector("form");
const textContainer = document.querySelector("#textContainer");
// sending the text to /api endpoint and fetching the last element from the array
const sendData = async (data) => {
  try {
    await fetch("https://global-clipboard.onrender.com/api", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    console.log("data sent");
    getAllTexts();
  } catch (error) {
    console.warn(error);
  }
};

// fetches the last text from the /texts endpoint || but all texts if "all" argument is passed
const getAllTexts = async (option) => {
  try {
    const resJSON = await fetch("https://global-clipboard.onrender.com/texts", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const response = await resJSON.json();
    insertTextsInDom(
      option === "all"
        ? response.texts
        : [response.texts[response.texts.length - 1]]
    );
    console.log(response);
  } catch (error) {
    console.warn(error);
  }
};
getAllTexts("all");

// shorthand function for appending the array of texts to the textContainer element
const insertTextsInDom = (array = []) => {
  array.forEach((text) => {
    textContainer.appendChild(createElement(text));
  });
};

const copyPressHandler = async () => {
  const queryOpts = { name: "clipboard-write", allowWithouGesture: false };
  const permissionStatus = await navigator.permissions(queryOpts);
  alert(permissionStatus.state);
};

// shorthand function for creating a element to be copied
const createElement = (content) => {
  const element = document.createElement("div");
  const textElement = document.createElement("div");
  const copyBtn = document.createElement("button");
  copyBtn.addEventListener("click", async () => {
    try {
      // alert(navigator)
      // copyPressHandler();
      await navigator.clipboard.writeText(content);
    } catch (error) {
      alert(error);
    }
  });
  copyBtn.textContent = "copy";
  textElement.textContent = content;
  element.appendChild(textElement);
  element.appendChild(copyBtn);
  return element;
};

// onsubmitting the form the text is sent to /api endpoint
form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendData(text.value);
});
