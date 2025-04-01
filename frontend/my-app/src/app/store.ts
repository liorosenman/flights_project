import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice.ts';
import loginReducer from '../components/Login/loginSlice.tsx'
import flightReducer from '../components/Flight/flightSlice.tsx'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    flight: flightReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
