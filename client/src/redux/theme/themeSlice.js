import {createSlice} from '@reduxjs/toolkit';
import { theme } from 'flowbite-react';

const initialState = {
    theme: 'dark',
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,

    //change the theme when the user clicks the button
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        }
    }
});

export const {toggleTheme} = themeSlice.actions;

//export the reducer so we can add it to the store
export default themeSlice.reducer;