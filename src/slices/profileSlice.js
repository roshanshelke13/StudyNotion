import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:localStorage.getItem("user")? JSON.parse(localStorage.getItem("user")) : null,
    loading:false,
    details:localStorage.getItem("details")?JSON.parse(localStorage.getItem("details")):null
};

const profileSlice = createSlice({
    name:"profile",
    initialState:initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state,value){
            state.loading = value.payload;
        },
        setProfile(state,value){
            state.details = value.payload;
        }
    }
})

export const {setUser,setLoading,setProfile} = profileSlice.actions;
export default profileSlice.reducer;