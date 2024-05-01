import DateTime from './DateTime';

function Availability({ userFullName, currentAvailability }) {
  return (
    <div className="col" id="availability-column">
      <div className="availability">
        <h5>{userFullName && `Welcome, ${userFullName}`}</h5>
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
