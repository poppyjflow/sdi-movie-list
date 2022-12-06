import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

const Home = () => {
  const [movieData, setMovieData] = useState([]);
  const [movieSearchData, setMovieSearchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //FETCH MISSION DATA
  useEffect(() => {
    if(!movieData[0]){
console.log(`fetch`)
    fetch("http://localhost:8081/")
      .then((res) => res.json())
      .then((data) => {
        return setMovieData(data);
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
    }
  }, );

  useEffect(() => {
    if(!movieSearchData[0]){
console.log(`setMovieSearchData`)
    return setMovieSearchData(movieData)
  }
}, );
  // Sets the "Search Term" on change of the search text box (default is "")
  const handleSearch = (event) => {
    if(movieSearchData[0]){
console.log(`movieSearchData`)
      setMovieSearchData(movieSearchData.filter(title => JSON.stringify(title).toLowerCase().includes(event.target.value.toLowerCase())));
    }
console.log(`setSearchTerm`)
    setSearchTerm(event.target.value)
  }

  if(!movieData[0]) { return;}
console.log(`render`)
  return (
          <>
    <Card border='light' style={{ width: '18rem' }} key='1' bg='dark' text='white'className="mission-card">
      <Card.Body className='card-body'>
        <Card.Text>
          {movieSearchData.map(movie => {
            return <p>{movie.title}</p>
          })}
        </Card.Text>
      </Card.Body>
    </Card>

    <div className="mainsearch">
      <input
          className="text-search-bar"
          type='text'
          placeholder="Search Movies"
          onChange={(event) => {handleSearch(event)}}
          value={searchTerm}
      />
  </div>
    </>
    )
//   }
}

export default Home
