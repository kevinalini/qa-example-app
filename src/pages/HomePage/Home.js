import React, { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineMinusCircle } from "react-icons/ai";

import data from "../../Data/qaData";
import "./styles/Home.css";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [err, setErr] = useState({ typeErr: true, msg: "Error message" });
  const [QAdata, setQAdata] = useState(data);

  const sortDataByOccurrences = (searchString) => {
    // Calculate the number of occurrences of the search string in each object
    const escapedSearchString = searchString.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const sortedData = data.map((item) => ({
      ...item,
      occurrences:
        (item.question + item.answer).split(
          new RegExp(escapedSearchString, "gi")
        ).length - 1,
    }));

    // Sort the data based on the number of occurrences in descending order
    sortedData.sort((a, b) => b.occurrences - a.occurrences);

    return sortedData;
  };

  const getTotalOccurrences = (QAdata, inputValue) => {
    let totalOccurrences = 0;

    QAdata.forEach((item) => {
      const escapedSearchString = inputValue.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(escapedSearchString, "gi");
      totalOccurrences +=
        (item.question + item.answer).match(regex)?.length || 0;
    });

    return totalOccurrences;
  };

  useEffect(() => {
    const total = getTotalOccurrences(QAdata, inputValue);

    if (total < 1) {
      setErr({
        typeErr: true,
        msg: "Sorry, we couldn't find any appears of your search",
      });
    } else {
      setErr({
        typeErr: false,
        msg: `We found ${total} appears for your search.`,
      });
    }
  }, [QAdata]);

  const handleSearch = () => {
    setQAdata(sortDataByOccurrences(inputValue));
  };
  return (
    <div className="homePageStyle">
      <header className="homePageHeader">
        <h2>This a sample for Question/Answer application.</h2>
      </header>

      <article className="homePageMainBody">
        <div className="searchBox">
          <h3>Type your question or type the keywords of your question.</h3>
          <div className="searchInput">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearch();
              }}
            />
            <BiSearchAlt className="searchBtn" onClick={handleSearch} />
          </div>
          <div className="errorBox">
            {inputValue.length > 0 && (
              <h5 className={!err.typeErr ? "Appears" : "NoAppears"}>
                {err.msg}
              </h5>
            )}
          </div>
        </div>
        {QAdata.map((singleQA) => {
          return (
            <div className="QAmainBox" key={singleQA.id}>
              <DisplayData singleQA={singleQA} searchString={inputValue} />
            </div>
          );
        })}
      </article>
    </div>
  );
}

const DisplayData = ({ singleQA, searchString }) => {
  const [show, setShow] = useState(false);
  const { question, answer } = singleQA;

  const highlightText = (text, searchString) => {
    const escapedSearchString = searchString.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(escapedSearchString, "gi");
    return text.replace(
      regex,
      (match) => `<span style="background-color: yellow">${match}</span>`
    );
  };
  return (
    <div className="QAbox">
      <div className={show ? "QAboxShowQ borderBt" : "QAboxShowQ "}>
        <h4>
          <span
            dangerouslySetInnerHTML={{
              __html: highlightText(question, searchString),
            }}
          ></span>
        </h4>
        {show ? (
          <AiOutlineMinusCircle
            className="PMicons MinusIcon"
            onClick={() => setShow(false)}
          />
        ) : (
          <AiOutlinePlusCircle
            className="PMicons PlusIcon"
            onClick={() => setShow(true)}
          />
        )}
      </div>
      {show && (
        <p>
          <span
            dangerouslySetInnerHTML={{
              __html: highlightText(answer, searchString),
            }}
          ></span>
        </p>
      )}
    </div>
  );
};

export default Home;
