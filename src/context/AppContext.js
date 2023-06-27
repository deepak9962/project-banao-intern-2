import React, { createContext, useReducer } from 'react';

export const AppReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TOKEN': {
            state.token = action.payload.token;
            state.rt = action.payload.rt;
            if (action.payload.user != null) {
                state.user = action.payload.user;
            }
            action.type = 'DONE';
            return {
                ...state
            };
        }

        case 'REFRESH_TOKEN': {
            state.token = action.payload.token;
            action.type = 'DONE';
            return {
                ...state
            }
        }

        case 'REMOVE_TOKEN': {
            state.token = action.payload.token;
            state.rt = action.payload.rt;
            action.type = 'DONE';
            return {
                ...state
            }
        }

        case 'SET_USER': {
            state.user = action.payload.user;
            action.type = 'DONE';
            return {
                ...state
            }
        }

        case 'SET_USER_STATUS': {
            state.user = action.payload.user;
            state.like = action.payload.like;
            action.type = 'DONE';
            return {
                ...state
            }
        }

        default: {
            return state;
        }
    }
}

const initialState = {
    token: null,
    rt: null,
    user: '',
    like: false
}

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    return (
        <AppContext.Provider
            value={{
                token: state.token,
                rt: state.rt,
                user: state.user,
                like: state.like,
                dispatch
            }}>
            {props.children}
        </AppContext.Provider>
    )
}