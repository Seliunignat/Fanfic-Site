import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { FanficCardOnMainPage } from "../components/FanficCardOnMainPage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const SearchResultsPage = (props) => {
  const { loading, request, error, clearError } = useHttp();
  const [results, setResults] = useState([]);
  const history = useHistory();
  const params = useParams()
  const [queryString, setQueryString] = useState(params && params.text);
  console.log(params)

  const search = useCallback(async () => {
    try {
      const findedResults = await request(
        `/api/search/?text=${queryString}`,
        "GET",
        null
      );

      setResults(findedResults.result);
      console.log(findedResults.result);
    } catch (e) {
      console.log(e.message);
    }
  }, [queryString, request]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  useEffect(() => {
    console.log(queryString);
    if (queryString) {
      search();
    }
  }, [queryString]);

    useEffect(() => {
        console.log(params.text)
        if(params.text){
            setQueryString(params.text)
        }
    }, [params.text])

    useEffect(() => {
        console.log("loading: " +loading)
    }, [loading])

    if (loading) {
        return <Loader />
      }

  return (
    <>
      {!loading && (
        <>
          <Navbar windowPage={"/search"}></Navbar>
            <h2>Результаты по запросу: {queryString}</h2>
          <section className="cCenterMainPage">
            {results &&
              results.map((result, index) => {
                return (
                  <div className="my-1">
                    <NavLink to={result && `/text/${result.objectID}/view`}>
                      <h1>{result.title}</h1>
                    </NavLink>
                  </div>
                );
              })}
          </section>
        </>
      )}
    </>
  );
};
