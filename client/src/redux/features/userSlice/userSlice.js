import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
    users: [],
    paths:  [],
    allpaths: [],
    length: null,
    isLoading: false,
    isProgress: false,
    isAllProgress: false,
}

//Поучение всех пользователей
export const getAllUsers = createAsyncThunk('user/getAllUsers', async(_,{rejectWithValue}) => {
    try {
        const { data } = await axios.get('/user/')
        return data
    } catch (error) {
        throw rejectWithValue(error.response.data.message)
    }
})


//Удаление пользователя
export const deleteUser = createAsyncThunk('user/delete', async({id}, {rejectWithValue}) => {
    try{
        const{data} = await axios.delete(`/user/${id}`, {id})
        return data
        }catch(error){
            throw rejectWithValue(error.response.data.message)
        }
    
})

//Получение лучшего маршрута
export const bestWaysUser = createAsyncThunk(
    'user/bestWaysUser',
    async({from, to, mode},{rejectWithValue}) => {
        try {
                console.log("Слайс best принял: ", {from, to, mode})
                const { data } = await axios.post('/user/route', {
                from,
                to,
                mode
            })
            if(data.path){
                window.localStorage.setItem('paths', data.path)
            }
            return (JSON.parse(JSON.stringify(data)))
        } catch (error) {
            throw rejectWithValue(error.response.data.message)
        }
    })

//Получение всех маршрутов
export const allWaysUser = createAsyncThunk(
    'user/allWaysUser',
    async({from, to, mode},{rejectWithValue}) => {
        try {
                console.log("Слайс all принял: ", {from, to, mode})
                const { data } = await axios.post('/user/routes', {
                from,
                to,
                mode
            })
            return data
        } catch (error) {
            throw rejectWithValue(error.response.data.message)
        }
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {NewWay: (state) =>{
        state.isProgress = false
        state.isAllProgress = false
    }
    },
    extraReducers: {

        // Get All
        [getAllUsers.pending]: (state) => {
            state.isLoading = true
        },
        [getAllUsers.fulfilled]: (state, action) => {
            state.isLoading = false
            state.users = action.payload?.users
        },
        [getAllUsers.rejected]: (state) => {
            state.isLoading = false
        },

        //delete
        [deleteUser.pending]: (state) => {
            state.isLoading = true
        },
        [deleteUser.fulfilled]: (state) => {
            state.isLoading = false
        },
        [deleteUser.rejected]: (state) => {
            state.isLoading = false
        },

        //bestWays
        [bestWaysUser.pending]: (state) => {
            state.isLoading = false
            state.isProgress = false
        },
        [bestWaysUser.fulfilled]: (state, action) => {
            state.isLoading = true
            state.status = action.payload?.message
            state.length= action.payload?.length
            state.paths.push(action.payload?.path)
            state.isProgress = true
        },
        [bestWaysUser.rejected]: (state) => {
            state.isLoading = false
            state.isProgress = true
        },
        
        //allWays
        [allWaysUser.pending]: (state) => {
            state.isLoading = false
            state.isAllProgress = false
        },
        [allWaysUser.fulfilled]: (state, action) => {
            state.isLoading = true
            state.status = action.payload?.message
            state.allpaths.push(action.payload?.paths)
            state.isAllProgress = true
        },
        [allWaysUser.rejected]: (state) => {
            state.isLoading = false
            state.isAllProgress =true
        },
    },
})

export const checkIsLoad = (state) => {
    Boolean(state.user.isProgress)
}

export const {NewWay} = userSlice.actions
export default userSlice.reducer