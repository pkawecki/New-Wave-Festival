import React, { useLayoutEffect } from "react";
import { Button, Progress, Alert } from "reactstrap";
import { io } from "socket.io-client";
import { API_URL } from "../../../config";
import "./SeatChooser.scss";
// let localSeats = [];

class SeatChooser extends React.Component {
  componentDidMount() {
    //Load the seats from API
    const { loadSeats, loadSeatsData } = this.props;
    loadSeats();

    //Socket runstart
    const socket = io(API_URL);
    socket.on("seatsUpdated", (seats) => {
      console.log("seatsUpdated received with data: ", seats);
      loadSeatsData(seats);

      //UPDATE reserved seats
      seats = seats.length;
      // console.log(reservedSeatsAmount);
    });
  }

  // const takenSeatsInDays = (seats)

  isTaken = (seatId) => {
    const { seats, chosenDay } = this.props;

    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  prepareSeat = (seatId) => {
    const { chosenSeat, updateSeat } = this.props;
    const { isTaken } = this;

    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className="seats__seat" color="primary">
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className="seats__seat" disabled color="secondary">
          {seatId}
        </Button>
      );
    else
      return (
        <Button
          key={seatId}
          color="primary"
          className="seats__seat"
          outline
          onClick={(e) => updateSeat(e, seatId)}
        >
          {seatId}
        </Button>
      );
  };

  render() {
    const { prepareSeat } = this;
    const { requests } = this.props;

    return (
      <div>
        <h3>Pick a seat</h3>
        <small id="pickHelp" className="form-text text-muted ml-2">
          <Button color="secondary" /> – seat is already taken
        </small>
        <small id="pickHelpTwo" className="form-text text-muted ml-2 mb-4">
          <Button outline color="primary" /> – it's empty
        </small>
        {requests["LOAD_SEATS"] && requests["LOAD_SEATS"].success && (
          <div className="seats">
            {[...Array(50)].map((x, i) => prepareSeat(i + 1))}
          </div>
        )}
        {requests["LOAD_SEATS"] && requests["LOAD_SEATS"].pending && (
          <Progress animated color="primary" value={50} />
        )}
        {requests["LOAD_SEATS"] && requests["LOAD_SEATS"].error && (
          <Alert color="warning">Couldn't load seats...</Alert>
        )}
        <div style={{ textAlign: "end" }}>{}Free seats: 2/15</div>
      </div>
    );
  }
}

export default SeatChooser;
