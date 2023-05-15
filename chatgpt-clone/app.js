const API_KEY = "<openapi_key>";

const submitButton = document.getElementById("submit");
const outPutElement = document.getElementById("output");
const inputElement = document.querySelector("input");
const historyElement = document.querySelector(".history");
const buttonElement = document.querySelector("button");

const changeInput = (value) => {
  const inputElement = document.querySelector("input");
  inputElement.value = value;
};

const getMessage = async () => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputElement.value }],
      max_tokens: 100,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );

    const data = await response.json();

    outPutElement.textContent = data.choices[0].message.content;

    if (data.choices[0].message.content && inputElement.value) {
      const pElement = document.createElement("p");
      pElement.textContent = inputElement.value;
      pElement.addEventListener("click", () =>
        changeInput(pElement.textContent)
      );
      historyElement.append(pElement);
    }
  } catch (error) {
    console.log(error.message);
  }
};

submitButton.addEventListener("click", getMessage);

const clearInput = () => {
  inputElement.value = "";
};

buttonElement.addEventListener("click", clearInput);
