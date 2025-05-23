"use client";

import { Provider } from "react-redux";
import React from "react";
import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

type TProps = { children: React.ReactNode };

const Providers = ({ children }: TProps) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
