"use client";

import LeaderBoard from "@/app/dashboard/components/LeaderBoard";
import Link from "next/link";
import React, { Component } from "react";

export default class Dashboard extends Component {
  render() {
    return (
      <>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,0"
        />
        <div data-theme="emerald">
          <div className="w-full bg-leaf-300 flex flex-row">
            <div className="flex flex-col">
              <Link
                href="/"
                className="w-full px-4 pt-3 pb-2 flex justify-center items-center space-x-3 relogo"
                onClick={() => {}}
              >
                <span className="self-center text-3xl font-semibold whitespace-nowrap text-leaf-900">
                  Resapling
                </span>
              </Link>
              <ul className="w-60 p-4 h-screen menu">
                <li>
                  <a className="text-leaf-900 bg-leaf-200 rounded-full" href="">
                    <span className="material-symbols-rounded">dashboard</span>
                    Dashboard
                  </a>
                  <a className="text-leaf-900 rounded-full" href="">
                    <span className="material-symbols-rounded">volunteer_activism</span>
                    Buat Komunitas
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full p-4 h-screen bg-leaf-50 flex flex-col gap-4">
              {/* Content */}
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
                <div className="flex-1">

                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
