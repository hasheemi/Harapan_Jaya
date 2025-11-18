"use client";

import LeaderBoard from "@/app/dashboard/components/LeaderBoard";
import Link from "next/link";
import React, { Component } from "react";
const name = "Ridwan"

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
          <div className="w-full bg-leaf-300 flex flex-row overflow-x-hidden">
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
            {/* Upgrade Account */}
            <div className="w-full p-10 h-screen bg-leaf-50 flex flex-col gap-4">
              <p className="text-2xl font-bold"> Hello {name}</p>
                <ul className="steps">
                  <li className="step step-primary">Biodata</li>
                  <li className="step">Data Yayasan</li>
                  <li className="step">File Yayasan</li>
                </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}
