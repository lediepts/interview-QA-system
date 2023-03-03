import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokenInfo } from 'interfaces'

const initialState: {
  auth?: TokenInfo
} = {
  auth: undefined,
}

const UISlice = createSlice({
  name: 'UI',
  initialState,
  reducers: {
    setAuth(state, { payload }: PayloadAction<TokenInfo | undefined>) {
      state.auth = payload
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(fetchAPI.fulfilled, (state, { payload }) => {
    //   state.data = payload
    // })
  },
})

export const UIAction = UISlice.actions

export const UIReducer = UISlice.reducer
