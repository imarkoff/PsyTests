"use client";

import React, { useEffect, useState } from "react";
import "./login.scss"

export default function Home() {

  const [passVisibility, setPassVisibility] = useState(false)

  return (
    <main>      
      <form>
        <div className="logo">
          {/* <img alt=""/> 
            Може бути лого якщо треба
          */}
          <h2>PsyTest</h2>
        </div>
        <hr />
        <h1>Login</h1>
        <h3>Email</h3>
        <input type="text" placeholder="your@email.com" className="email"/>
        <h3>Password</h3>
        <div className="password_cont">
          <input type={passVisibility ? "text" : "password"} placeholder="password" className="password"/>
          <button type="button" className="show_pass" onClick = {() => { passVisibility ? setPassVisibility(false) : setPassVisibility(true) }}>{passVisibility ? "Hide" : "Show"}</button>
        </div>
        <div className="remem_me">
          <input type="checkbox" id="remem_me"/>
          <label htmlFor="remem_me">Remember me</label>
        </div>
        <button className="sign_in">Sign in</button>
        <div className="other">
          <a href="">Forgot password?</a>
          <a href="">Sing up</a>
        </div>
      </form>
    </main>
  );
}
