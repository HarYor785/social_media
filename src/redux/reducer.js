import { combineReducers } from "@reduxjs/toolkit";
import themeSlice from "./theme"
import userSlice from "./userSlice";
import postSlice from "./postSlice";


const rootReducer = combineReducers({
    user: userSlice,
    theme: themeSlice,
    posts: postSlice,
})

export {rootReducer}