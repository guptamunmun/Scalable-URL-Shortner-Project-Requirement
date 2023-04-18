import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const LinkResult = ({ inputValue }) => {
  const [sortenLink, setSortenLink] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    if (inputValue) {
      setSortenLink(`localhost:3000/${inputValue}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [inputValue]);

  return (
    <>
      {sortenLink && (
        <div className="result">
          <p>{sortenLink}</p>

          <CopyToClipboard text={sortenLink} onCopy={() => setCopied(true)}>
            <button className={copied ? "copied" : ""}>
              Copy to clipboard
            </button>
          </CopyToClipboard>
        </div>
      )}
    </>
  );
};

export default LinkResult;
