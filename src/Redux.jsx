import { useSelector,useDispatch } from "react-redux";
import { increament } from "./store";
const Redux = () => {
  const count = useSelector((state) => {
    return state.counter.count
  });
  const dispatch = useDispatch()

  function handleinc(){
dispatch(increament)
  }

  function handledec(){
dispatch({type:"DEC"})
  }
  
  return (
    <div>
      <h1>hello {count}</h1>
      <button onClick={handleinc}>Increament</button>
            <button onClick={handledec}>decreament</button>

    </div>
  );
};

export default Redux;
