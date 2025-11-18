"use client";

import { Component } from "react";
import Root from "../components/Root";
import Podium from "./components/podium";

export default class Dashboard extends Component {
  render() {
    return (
      <Root>
        <div className="w-full max-w-3xl flex flex-row gap-4 ">
          <Podium item={LeaderBoardItem[1]} index={1}/>
          <Podium item={LeaderBoardItem[0]} index={0}/>
          <Podium item={LeaderBoardItem[2]} index={2}/>
        </div>
        <div className="w-full card bg-base-200 p-2 max-w-3xl">
          <span className="text-xl font-bold p-2">LeaderBoard</span>
          {LeaderBoardItem.map((item, index) => (
            <div key={index}>
              {index >= 3 && (
                <>
                  <button className="w-full flex flex-row items-center justify-center hover:bg-base-300 transition duration-150 p-2">
                    <div className="text-4xl font-thin opacity-30 tabular-nums mr-4">
                      {index + 1}
                    </div>
                    <div className="avatar">
                      <div className="w-14 rounded-full">
                        <img src={item.image} />
                      </div>
                    </div>
                    <div className="px-4 flex-1 flex flex-col items-start">
                      <span className="">{item.name}</span>
                    </div>
                    <div>
                      <span>{item.amount}</span>
                    </div>
                  </button>
                  {index != LeaderBoardItem.length - 1 && (
                    <div className="h-[0.5] rounded mx-4 bg-base-300"></div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="join">
          <button className="join-item btn">1</button>
          <button className="join-item btn btn-primary">2</button>
          <button className="join-item btn">3</button>
          <button className="join-item btn">4</button>
        </div>
      </Root>
    );
  }
}

const LeaderBoardItem = [
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Smith John",
    amount: "Rp100.000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Smith John",
    amount: "Rp100.000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Smith John",
    amount: "Rp100.000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "John Smith",
    amount: "Rp100.000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "John Smith",
    amount: "Rp100.000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "John Smith",
    amount: "Rp100.000",
  },
  {
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=723&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "John Smith",
    amount: "Rp100.000",
  },
];
