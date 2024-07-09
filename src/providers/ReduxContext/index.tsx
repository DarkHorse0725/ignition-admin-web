import { store } from "@/store";
import { Provider } from "react-redux";

export const ReduxProviders = ({ children }: any) => {
  return <Provider store={store}>{children}</Provider>;
};
