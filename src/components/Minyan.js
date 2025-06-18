
import { useNavigate, useParams } from 'react-router-dom';

function Minyan({ minyan }) {




  return (
    <>
      <div className="minyan">
        <h4>{minyan.time}</h4> 

        <h4>{minyan.locatin}</h4>
        <button ></button>

      </div>
    </>
  );
}

export default Minyan;
