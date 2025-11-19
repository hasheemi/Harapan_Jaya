"use client";

import { Component, useState } from "react";
import Root from "../../components/Root";
import Nathan from "@/public/assets/img/person/nathan.jpg"

function MediaSosial(){
    let [socialMediaUrl, setSocialMediaUrl] = useState("https://");
    return(
        <>
            <fieldset className="fieldset">
                        <legend className="fieldset-legend">Media Sosial</legend>
                        <input className="input w-full" type="url" required placeholder="https://" value={socialMediaUrl}
                            onChange={(e)=> setSocialMediaUrl(e.target.value)}
                        pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                        title="Must be valid URL" />
            </fieldset>
        </>
    )
}

export default class Profile extends Component {

  render() {
    return (
    <Root show={true}>
        <>
        <div className="flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
        </div>
    <div className="w-full h-screen bg-leaf-50 flex flex-col gap-4">
        <div className="bg-gray-100 max-w-7xl rounded-lg shadow-lg flex">
            {/*
            <!-- Sidebar Profile --> */}
            <div className="w-1/3 border-r border-gray-200 p-8 flex flex-col items-center">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile"
                    className="rounded-full w-28 h-28 object-cover mb-4" />
                <button className="btn btn-primary btn-sm p-3"><p className="text-m">
                    UPLOAD NEW AVATAR
                </p></button>
            </div>

            {/*
            <!-- Main Content Form --> */}
            <form className="flex-1 p-10 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Info Pribadi</h2>
                </div>
                {/*
                <!-- Basic Info Fields --> */}
                <div className="grid grid-cols-1 gap-6">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Nama</legend>
                        <input type="text" className="input w-full" placeholder="Type here"  />
                    </fieldset>
                </div>

                <div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Nomor Telepon</legend>
                        <input type="number" className="input w-full" placeholder="Type here"  />
                    </fieldset>
                </div>
                {/* Yayasan Info */}
                <div className="flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800">Info Yayasan</h2>
                </div>
                <div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Nama Yayasan</legend>
                        <input type="text" className="input w-full" placeholder="Type here"  />
                    </fieldset>
                </div>
                <div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Alamat Yayasan</legend>
                        <input type="text" className="input w-full" placeholder="Type here"  />
                    </fieldset>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">NPWP</legend>
                        <input type="number" className="input w-full" placeholder="Type here"  />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Nomor Telepon</legend>
                        <input type="text" className="input w-full" placeholder="Type here"  />
                    </fieldset>
                </div>
                <MediaSosial />

                {/*
                <!-- About Me --> */}
            </form>
        </div>
    </div>
        </>
    </Root>
    );
  }
}
