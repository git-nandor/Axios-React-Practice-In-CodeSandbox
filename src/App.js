import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "./config";
import "./styles.css";

export default function App() {
  const [searchValue, setSearchValue] = useState("");
  const [searchInfo, setSearchInfo] = useState(() => "Start typing for search");
  const [requestedData, setrequestedData] = useState(() => "");
  const [selectedBreed, setSelectedBreed] = useState(() => "");
  const appConfig = config();

  const clearUi = () => {
    setSelectedBreed("");
    setrequestedData("");
  };

  const handleInputChange = (event) => {
    clearUi();
    if (event.target.value !== "") {
      setSearchInfo("Loading...");
    } else {
      setSearchInfo("Start typing for search");
    }

    setTimeout(
      (event) => {
        setSearchValue(event.target.value);
        console.log("SetSearch to:", event.target.value);
      },
      25000,
      event
    );
  };

  const handleBreedSelect = (id) => {
    setSelectedBreed(requestedData[id]);
  };

  const handleAddSearchValue = (newValue) => {
    setSearchValue(newValue);
    console.log("Add: ", newValue);
  };

  useEffect(() => {
    console.log("trigger useEffect and Axios with new:", searchValue);
    const handleRequest = async () => {
      try {
        const response = await axios.get(`${appConfig.url}/?q=${searchValue}`, {
          headers: { "x-api-key": appConfig.key }
        });

        if (response.status === 200) {
          setrequestedData(response.data);
          setSearchInfo(`Results for ${searchValue}: `);
        }
      } catch (error) {
        setSearchInfo(`Sorry ¯\\_(ツ)_/¯ something went wrong!`);
      }
    };

    if (searchValue !== "") {
      handleRequest(searchValue);
    }
  }, [searchValue]);

  const SearchInfo = () => {
    return <div> {searchInfo} </div>;
  };

  const SelectedBreed = () => {
    return (
      <div>
        <h2> {selectedBreed.name} </h2>
        <div> {selectedBreed.description} </div>
      </div>
    );
  };

  const SearchResult = () => {
    //searchInfo = 'Start typing for search'; // ???? how to set with useRef, triggered by searchValue changes
    let resultElement = "";

    if (requestedData !== "") {
      const results = requestedData.map((result, index) => {
        // ??? how to custom props... must full lowercase as: dataindex but...
        return (
          <button key={result.id} onClick={() => handleBreedSelect(index)}>
            {result.name}
          </button>
        );
      });
      resultElement = results;
    } else if (requestedData === "error") {
      resultElement = "";
    }

    return <div> {resultElement} </div>;
  };

  return (
    <div className="App">
      <h1>CodeSandbox React Practice</h1>
      <h2>Lets search for cat breeds!</h2>
      <div>
        <form>
          <label htmlFor="searchInput">Search: </label>
          <input id="searchInput" onChange={handleInputChange} />
        </form>
        <br />
        <hr />
        <br />
        <button id={123} onClick={() => handleAddSearchValue("subidubi")}>
          subidubi
        </button>
        <SearchInfo />
        <SearchResult />
        <SelectedBreed />
      </div>
    </div>
  );
}
