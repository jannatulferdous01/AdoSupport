"use client";

import { Provider } from "react-redux";
import React from "react";
import store from "@/redux/store";

type TProps = { children: React.ReactNode };

const Providers = ({ children }: TProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
