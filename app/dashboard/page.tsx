"use client";

import { Component } from "react";
import Root from "./components/Root";
import LeaderBoard from "./components/LeaderBoard";

export default class Dashboard extends Component {
  render() {
    return (
      <Root>
        <div className="w-full p-2 bg-base-200 rounded-box flex flex-row items-center">
          <div className="w-16 rounded-full overflow-hidden">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
          <div className="px-4 flex-1">
            <p className="text-lg">Welcome Aaron</p>
            <div className="badge badge-warning">Warning</div>
          </div>
          <button className="btn btn-square btn-ghost">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
        <div className="flex flex-row gap-4">
          {/* Left */}
          <div className="flex-1">
            <LeaderBoard />
          </div>
          {/* Right */}
          <div className="flex-1"></div>
        </div>
      </Root>
    );
  }
}
