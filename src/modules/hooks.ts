import { useDispatch } from "react-redux";
import configureStore, { AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
