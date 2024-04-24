import DateTime from './DateTime';

function Availability({ userEmail, currentAvailability }) {
  return (
    <div className="col">
      <div className="availability">
        <h5>{userEmail && `Welcome, ${userEmail}`}</h5>
      </div>
      <div className="availability">
        <DateTime />
      </div>
      <div className="availability">
        <h5>Current Availability</h5>
        {!currentAvailability && <p>Fetching availability...</p>}
        {currentAvailability && <p>{currentAvailability} spots remaining</p>}
      </div>
    </div>
  );
}

export default Availability;
