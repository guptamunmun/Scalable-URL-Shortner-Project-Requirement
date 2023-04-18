import React, { useState } from "react";

const InputShortner = ({ setInputValue }) => {
  const [longUrl, setValue] = useState("");

  const handleClick = async () => {
    let result = await fetch("http://localhost:3000/shorten", {
      method: "POST",
      body: JSON.stringify({ longUrl }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    result = await result.json();
    // console.log(result.data.shortUrl);
    setInputValue(result.data.shortUrl);
    setValue("");
  };

  return (
    <div className="inputContainer">
      <h1>
        URL <span>SHORTNER</span>
      </h1>
      <div>
        <input
          type="text"
          placeholder="Paste Url to Shorten"
          value={longUrl}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleClick}>SHORTEN</button>
      </div>
    </div>
  );
};

export default InputShortner;
