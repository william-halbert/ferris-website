import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";

function Image() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://chat-with-notes-server-b9f51be04d4f.herokuapp.com/api/image",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const renderTextWithLatex = (text) => {
    const pattern = /(\\\(.+?\\\)|\\\[\s*(.+?)\s*\\\])/g;

    let match;
    const segments = [];
    let lastIndex = 0;

    while ((match = pattern.exec(text)) !== null) {
      segments.push(text.slice(lastIndex, match.index)); // Push the non-LaTeX text
      segments.push(match[0]); // Push the matched LaTeX
      lastIndex = pattern.lastIndex;
    }
    segments.push(text.slice(lastIndex)); // Push the remaining non-LaTeX text

    return segments.map((segment, index) => {
      if (segment.startsWith("\\(") && segment.endsWith("\\)")) {
        return <InlineMath key={index} math={segment.slice(2, -2)} />;
      } else if (segment.startsWith("\\[") && segment.endsWith("\\]")) {
        return <BlockMath key={index} math={segment.slice(2, -2)} />;
      } else {
        return segment;
      }
    });
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload and Extract Text</button>
      {result && (
        <div>
          <h3>Text Result:</h3>
          <div>{renderTextWithLatex(result.text)}</div>
        </div>
      )}
    </div>
  );
}

export default Image;
