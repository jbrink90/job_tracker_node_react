import { render, screen, fireEvent } from "@testing-library/react"
import {Terms} from "../../../pages"
import { describe, it, expect } from "vitest"
import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import NewNavBar from "..";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#242424",
      paper: "#3a3a3a",
    },
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#939292",
      paper: "#eae8e8",
    },
  },
});

describe("NewNavBar", () => {
    it("should display dark theme", () => {
     render(<ThemeProvider theme={darkTheme}>
      <Router>
        <NewNavBar siteTheme="dark" setSiteTheme={()=>{}}/>
        <Terms />
      </Router>
      </ThemeProvider>);

      const themeButton = screen.getByTestId("toggle_theme")
      const box = screen.getByTestId("terms_box");
      expect(box).toMatchSnapshot();


      fireEvent.click(themeButton);
            expect(box).toMatchSnapshot();


    });
});