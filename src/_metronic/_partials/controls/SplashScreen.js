import React from "react";
import { CircularProgress } from "@material-ui/core";
import { toAbsoluteUrl } from "../../_helpers";

export function SplashScreen() {
  return (
    <>
      <div className="splash-screen">
        <img
          src={toAbsoluteUrl("/media/logos/leaf-green-512.png")}
          alt="Bailarn logo"
        />
        <CircularProgress className="splash-screen-spinner" />
      </div>
    </>
  );
}
