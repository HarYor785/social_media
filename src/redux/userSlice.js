import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
    edit: false,
    tab: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        login(state, action){
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        logout(state){
            state.user = null,
            localStorage.removeItem("user")
        },
        updateProfile(state, action){
            state.edit = action.payload
        },
        requestTab(state, action){
            state.tab = action.payload
        }
    }
})

export default userSlice.reducer

export const userLogin = (user) =>{
    return (dispatch, getState)=>{
        dispatch(userSlice.actions.login(user))
    }
}

export const userLogout = ()=>{
    return(dispatch, getState)=>{
        dispatch(userSlice.actions.logout())
    }
}

export const updateProfile = (val) =>{
    return (dispatch, getState)=>{
        dispatch(userSlice.actions.updateProfile(val))
    }
}

export const toggleRequestTab = (val) =>{
    return (dispatch, getState)=>{
        dispatch(userSlice.actions.requestTab(val))
    }
}