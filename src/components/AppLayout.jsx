import { useEffect } from "react";
import {applySavedTheme} from "../utils/theme";
import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import "../App.css";

export function AppLayout(){
  useEffect(() => applySavedTheme(), [])

  return(
  <main>
    <header>
      <h1>Games Lobby</h1>
    </header>
    <Navigation />
    <Outlet />
  </main>
  )
}