import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './UserPasses.css';

function UserPasses({
  email,
  handleShowAddTimeModal,
  passes,
  fetchPasses,
  fetchAvailability,
}) {
  /* State variable for time remaining for each pass */
  const [timeRemaining, setTimeRemaining] = useState({});

  function refreshPassesAndAvailability() {
    fetchPasses(email);
    fetchAvailability();
  }

  /* Calculate time remaining for each pass every minute */
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const remaining = passes.reduce((acc, pass) => {
        const endTime = new Date(pass.startTime);
        endTime.setHours(endTime.getHours() + pass.duration);
        const diff = endTime - now;
        const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );
        acc[pass.passID] = `${hoursRemaining}h ${minutesRemaining}m`;

        if (hoursRemaining <= 0 && minutesRemaining <= 0) {
          // Pass has expired
          acc[pass.passID] = 'Expired';
        }

        return acc;
      }, {});
      setTimeRemaining(remaining);
    };

    calculateTimeRemaining();

    const intervalId = setInterval(calculateTimeRemaining, 60000); // Update every minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  /* Display passes loading or no passes depending on the state of the passes parameter */
  if (!passes) {
    return <h5>Loading passes...</h5>;
  }

  if (passes.length === 0) {
    return (
      <h5 className="none-found-text">
        You do not have any live passes. Please purchase one via the menu on the
        left.
      </h5>
    );
  }

  return (
    <table className="current-passes">
      <thead>
        <tr>
          <th>
            <h4 className="user-passes">Your Passes</h4>
          </th>
          <th></th>
          <th className="fetch-passes-cell">
            <Button
              className="fetch-passes-button"
              variant="secondary"
              onClick={() => refreshPassesAndAvailability()}
              style={{ fontSize: '12px' }}
            >
              Refresh
            </Button>
          </th>
        </tr>
        <tr className="header-row">
          <th className="license-plate">License Plate</th>
          <th>Time Remaining</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {passes
          .filter((pass) => timeRemaining[pass.passID] !== 'Expired')
          .map((pass) => (
            <tr
              key={pass.passID ? `pass-${pass.passID}` : `pass-${pass.license}`}
              className="pass-row"
            >
              <td className="license-plate">{pass.license}</td>
              <td>{timeRemaining[pass.passID] || 'Calculating...'}</td>
              <td className="add-time-cell">
                <Button
                  id="add-time-button"
                  className="primary-button"
                  variant="primary"
                  onClick={() =>
                    handleShowAddTimeModal(
                      pass.passID,
                      timeRemaining[pass.passID]
                    )
                  }
                >
                  Add Time
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default UserPasses;
