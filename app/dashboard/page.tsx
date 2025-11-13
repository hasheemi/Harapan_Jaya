"use client";

import React, { Component } from "react";

export default class Dashboard extends Component {
  render() {
    return (
      <>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@latest/dist/full.min.css"
          rel="stylesheet"
        />
        <div className="drawer drawer-open" data-theme="dim">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col items-center">
            <div className="p-2 w-full flex flex-col gap-2">
              <div className="p-2 bg-base-200 rounded-box flex flex-row items-center">
                <div className="w-16 rounded-full overflow-hidden">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
                <div className="px-4">
                  <p className="text-lg">Welcome Aaron</p>
                  <div className="badge badge-warning">Warning</div>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-2 rounded-box bg-base-200 p-2">
                    <div className="flex flex-row">Lorem Ipsum</div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="rounded-box bg-base-200 p-2">Gurt : Yo</div>
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-side">
            <ul className="menu bg-base-200 min-h-full w-60 p-4">
              <li>
                <a className="bg-primary text-primary-content">
                  <span className="material-symbols-rounded">dashboard</span>
                  Dashboard
                </a>
                <a>
                  <span className="material-symbols-rounded">home</span>Home
                </a>
                <a>
                  <span className="material-symbols-rounded">
                    volunteer_activism
                  </span>
                  Buat Komunitas
                </a>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}
