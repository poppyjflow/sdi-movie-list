//import '../styling/missions.css';
import React, { useState, useEffect, useContext } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
//import TeamContext from "./TeamsContext";
// import Modal from 'react-bootstrap/Modal';
// import Col from "react-bootstrap/Col";
// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
// import Row from "react-bootstrap/Row";

const Teams = () => {
  const [movieData, setMovieData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [teamData, setTeamData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const { clickedTeam, setClickedTeam } = useContext(TeamContext)
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({});
  const [validated, setValidated] = useState(false);

  // Search Functionality States:
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //FETCH MISSION DATA
  useEffect(() => {
    fetch("http://localhost:8081/")
      .then((res) => res.json())
      .then((data) => {
        setMovieData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  }, [refresh]);

  //Build Card Layout
  const renderMovieCard = (team, index) => {
    return (
    <Card border='light' style={{ width: '18rem' }} key={index} bg='dark' text='white'className="mission-card">
      <Card.Header>{team.name}</Card.Header>
      <Card.Body className='card-body'>
        <Card.Text>
          {movieData.forEach(movie => {
            let movieId = movie.id
            let teamMovieId = (team['movie_id'])
            if (movieId === teamMovieId) {
              team.movie_location = movie.location
            }
          })}
          Current Location: {team.movie_location}
        </Card.Text>
        <Card.Subtitle className="mb-2 text-muted"># of personnel: {team.current_size} </Card.Subtitle>
        <div className='buttons'>
        <Link to={`/teams/${team.id}`} style={{color: 'white', textDecoration: 'none'}}>
        <Button variant="secondary" onClick={() => {setClickedTeam(team)}}>
          Team Info
        </Button>
        </Link>
        <Button variant="danger" onClick={() => {
          setClickedTeam(team)
          handleDeleteShow()
        }}>Delete Team</Button>
        </div>
      </Card.Body>
    </Card>
    )
  }

  //DATA HANDLERS

  //Call this to refresh the mission list
  const toggleRefresh = () => {
    setRefresh((current) => !current);
  };

  //Open "Personnel" form
  const handleShow = () => setShow(true);

  //Set state for the "Add personnel" form
  const handleFormData = (event) => {
    let newData = { ...formData };
    newData.current_size = 0;
    newData[event.target.id] = event.target.value;
    setFormData(newData);
  };

  //Close "Add mission" form
  const handleClose = () => {
    setValidated(false);
    setShow(false);
    setFormData({});
  };

  //set Add State
  const handleAdd = () => {
    handleShow();
  }

  //ADD Team
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.stopPropagation();
      }
      setValidated(true);
      let response = await fetch("http://localhost:8081/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setFormData({});
      handleClose();
      toggleRefresh();
      if (response.status !== 201) {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Delete a team
  const handleDeleteClose = () => setShowDelete(false)
  const handleDeleteShow = () => setShowDelete(true)

  const deleteTeam = async() => {
    try {
      let teamDelete = await fetch(`http://localhost:8081/teams/${clickedTeam.id}`,  { method: "DELETE" })
      if(teamDelete.status !== 202){
      throw new Error()
      }
      handleDeleteClose();
      toggleRefresh();
    } catch(err){
      console.log(err)
      handleDeleteClose();
    }
  }

  const sortTeams = (teamsArray) => {
    return teamsArray.sort((a, b) => {
      if (a.name) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {return -1};
        if (nameA > nameB) {return 1};
        return 0;
      }
    })
  }

    //// Search Functions////

  // Sets the "Search Term" on change of the search text box (default is "")
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
}

//Filters the data without having to select a "Search By" Category
useEffect(() => {
  let searchArray = [];
    teamData.forEach((team) => {
      let teamDataString = JSON.stringify(team)
      if (teamDataString.toLowerCase().includes(searchTerm.toLowerCase())) {
        searchArray.push(team)
      }
      setFilteredData(searchArray)
    })
}, [searchTerm])

  return (
    <>
      <h1 className='teams-header'>Teams</h1>
      <div className='nav-buttons'>
        <Button variant='success' className='add-mission' onClick={handleAdd}>
          Add Team
        </Button>
        <Link className='homepage-button-personnel' to='/'>
        <Button variant='primary' className='homepage-button'>
          Back to Home
        </Button>
        </Link>
      </div>

      <div className="mainsearch">
          <input
              className="text-search-bar"
              type='text'
              placeholder="Search Teams"
              onChange={(event) => {handleSearch(event)}}
              value={searchTerm}
          />
      </div>

      <div className="mission-card-container">
        {sortTeams([...filteredData]).map(renderMovieCard)}
      </div>
    </>
  );
}

export default Teams