import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function UserPasses({ email, handleShowAddTimeModal, passes }) {
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const remaining = {};
      passes.forEach((pass) => {
        const endTime = new Date(pass.startTime);
        endTime.setHours(endTime.getHours() + pass.duration);
        const diff = endTime - now;
        const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );
        remaining[pass.id] = `${hoursRemaining}h ${minutesRemaining}m`;
      });
      setTimeRemaining(remaining);
    };

    calculateTimeRemaining();

    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [passes]);

  if (passes.length === 0) {
    return <h5>No passes found</h5>;
  }

  return (
    <table className="current-passes">
      <thead>
        <tr>
          <th>
            <h5 style={{ marginBottom: '30px' }} className="user-passes">
              Your Passes
            </h5>
          </th>
        </tr>
        <tr className="header-row">
          <th>License Plate</th>
          <th>Time Remaining</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {passes.map((pass) => (
          <tr key={`pass-${pass.id}`}>
            <td key={`license-${pass.id}`}>{pass.license}</td>
            <td key={`time-${pass.id}`}>{timeRemaining[pass.id]}</td>
            <td key={`button-${pass.id}`}>
              <Button
                className="add-time-button"
                variant="secondary"
                onClick={() => handleShowAddTimeModal(pass.id)}
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
