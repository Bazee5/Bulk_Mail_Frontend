import { configureStore } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    count:10
}
const  counterSlice = createSlice(
    {
        name:"counter",
initialState,       
 reducers:{
            increament:function(state){
                state.count =state.count+1
            }
        }

    }
)



const store = configureStore({
reducer: {
    counter:counterSlice.reducer
}

})

 const {increament} =counterSlice.actions
export default store
export {increament}