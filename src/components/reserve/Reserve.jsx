import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useState, useContext } from 'react'
import "../../components/reserve/reserve.scss"
import useFetch from '../../hooks/useFetch'
import axios from 'axios'
import { SearchContext } from '../../context/SearchContext'
import { useNavigate } from 'react-router-dom'

const Reserve = ({setOpen, hotelId}) => {

    const [selectedRooms, setSelectedRooms] = useState([]);
    const { dates } = useContext(SearchContext);
    const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`)
   
    
    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime());
        const dates = []


        while (date <= end) {
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1)
        }
        return dates;
    }
    const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some((date) => allDates.includes(new Date(date).getTime()));
        return !isFound;
    }

    
    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter((item) => item !== value))
    }

    const navigate = useNavigate();


    const handleClick = async () => {
        try {
            await Promise.all(selectedRooms.map((roomId) => {
                const res = axios.put(`/rooms/availability/${roomId}`, {dates: allDates});
                return res.data;
            }))
            setOpen(false);
            navigate('/');
    }
        catch(err) {

        }
    }

    console.log(selectedRooms);

  return (
    <div className="reserve">
        <div className="rContainer">
            <FontAwesomeIcon style={{color: 'red'}} icon={faCircleXmark} className='rClose' onClick={() => setOpen(false)} />
            <span> Select your rooms: </span>
            {data.map((item, id) => (
                <div className="rItem" key={id}>
                    <div className="rItemInfo">
                        <div className="rTitle"> {item.title} </div>
                        <div className="rDesc"> {item.desc} </div>
                        <div className="rMax"> <p> Max people {item.maxPeople} </p> </div>
                        <div className="rPrice"> {item.price} </div>
                        </div>
                        <div className="selectRooms">
                        {item.roomNumbers.map((roomNumber, id) => (
                            <div className="room" key={id}> 
                            <label> {roomNumber.number} </label>
                            <input type="checkbox" value={roomNumber._id} onChange={handleSelect} disabled={!isAvailable(roomNumber)}/>
                            </div>
                        ))} 
                        </div>
                        </div>
                        ))}
                        <button className="rButton" onClick={handleClick}> Reserve now </button>
        </div>
    </div> 
  )
}

export default Reserve