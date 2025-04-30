import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice.ts';
import loginReducer from '../components/Login/loginSlice.tsx'
import flightReducer from '../components/Flight/flightSlice.tsx'
import  userReducer  from '../components/createusers/createUserSlicer.tsx';
import countryReducer from '../components/countries/countrySlicer.tsx';
import airlineReducer from '../components/users/airline/airlineSlicer.tsx';
import ticketReducer from '../components/ticket/ticketSlicer.tsx';
import customersReducer from '../components/users/customers/customersSlice.tsx';
import adminReducer from '../components/users/admins/adminsSlice.tsx'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    login: loginReducer,
    user: userReducer,
    country: countryReducer,
    airline: airlineReducer,
    flight: flightReducer,
    ticket: ticketReducer,
    customer: customersReducer,
    admin: adminReducer,
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
