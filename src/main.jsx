import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { applySavedTheme } from "./utils/theme.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./components/AppLayout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LobbyView } from "./pages/LobbyPage.jsx";
import { RPSGamePage } from "./pages/RPSGamePage.jsx";
import { TicTacToePage } from "./pages/TicTacToePage.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BattleshipPage } from "./pages/BattleshipPage.jsx";

applySavedTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage />},
      { path: '/lobby', element: <LobbyView />},
      {path: '/game/rps', element: (
        <ProtectedRoute>
          <RPSGamePage />
        </ProtectedRoute>
      )},
      {path: '/game/tic-tac-toe', element: (
        <ProtectedRoute>
          <TicTacToePage />
        </ProtectedRoute>
      )},
      {path: '/game/battleship', element: (
        <ProtectedRoute>
          <BattleshipPage />
        </ProtectedRoute>
      )}
    ],
  },
])

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
