"use client";

import { Component, useState } from "react";
import Root from "../components/Root";
import LeaderBoard from "../components/LeaderBoard";

let data_user = {
    nama : "",
    
}

function ChangeData(){

}

function Biodata() {
    let [Nama, setNama] = useState("Type here");
    let [NomorTelepon, setNomorTelepon] = useState("Type here");
    let [KTP, setKTP] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKTP(file);
    }
    console.log(KTP);
  };

    return(
        <>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nama</legend>
                <input type="text" className="input w-full" placeholder="Type here" value={Nama} 
                onChange={(e)=> setNama(e.target.value)}
                />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Nomor Telepon</legend>
                <input type="number" className="input w-full" placeholder="Type here" value={NomorTelepon}
                onChange={(e)=> setNomorTelepon(e.target.value)} />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">KTP</legend>
                <input type="file" className="file-input w-full" 
                onChange={handleFileChange}/>
            </fieldset>
        </>
    )
}

function DataYayasan() {
    let [socialMediaUrl, setSocialMediaUrl] = useState("https://");
    let [NamaYayasan, setNamaYayasan] = useState("Type Here");
    let [AlamatYayasan, setAlamatYayasan] = useState("Type Here");
    let [NomorTelepon, setNomorTelepon] = useState();
    let [NPWP, setNPWP] = useState();

    return(
        <>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nama Yayasan</legend>
            <input type="text" className="input w-full" placeholder="Type here" value={NamaYayasan}/>
        </fieldset>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Alamat Yayasan</legend>
            <input type="text" className="input w-full" placeholder="Type here" value={AlamatYayasan}/>
        </fieldset>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Nomor Telepon</legend>
            <input type="number" className="input w-full" placeholder="Type here" value={NomorTelepon} />
        </fieldset>
        <fieldset className="fieldset">
            <legend className="fieldset-legend">NPWP Yayasan</legend>
            <input type="number" className="input w-full" placeholder="Type here" value={NPWP}/>
        </fieldset>
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

function File() {

    return(
        <>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Surat Izin Operasional</legend>
                <input type="file" className="file-input w-full" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Surat Pendirian LSM</legend>
                <input type="file" className="file-input w-full" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Surat Pengesahan Badan Hukum</legend>
                <input type="file" className="file-input w-full" />
            </fieldset>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Surat Domisili Yayasan</legend>
                <input type="file" className="file-input w-full" />
            </fieldset>
        </>
    )
}

function KonfirmasiUlang() {
    return(
        <>
            <p>Konfirmasi data yang telah dimasukkan:</p>
            {/* Add confirmation logic here */}
        </>
    )
}

export default function Campaign() {
    let [Step, setStep] = useState(0);

    const handleNextStep = (step: number) => {
        if (Step < 3) {
            setStep(step);
        }
    };

    const renderStepContent = () => {
        switch (Step) {
            case 0:
                return <Biodata />;
            case 1:
                return <DataYayasan />;
            case 2:
                return <File />;
            case 3:
                return <KonfirmasiUlang />;
            default:
                return <Biodata />;
        }
    };

    const getStepClass = (index: number) => {
        if (index < Step) return "step step-success";
        if (index === Step) return "step step-primary";
        return "step";
    };

        return (
            <Root>
                <div className="w-full h-screen bg-leaf-50 flex flex-col gap-4 bg-amber-200">
                    <p className="text-2xl font-bold"> Hello</p>
                    <ul className="steps">
                        <li onClick={() => handleNextStep(0)} className={getStepClass(0)}>Biodata</li>
                        <li onClick={() => handleNextStep(1)} className={getStepClass(1)}>Data Yayasan</li>
                        <li onClick={() => handleNextStep(2)} className={getStepClass(2)}>File Yayasan</li>
                        <li className={getStepClass(3)}>Konfirmasi Ulang</li>
                    </ul>
                    <div className="w-full flex justify-center ">
                        <div className="w-2xl bg-blue-200 rounded-xl p-4 flex flex-col gap-3">
                            {renderStepContent()}
                            <button className="btn btn-success w-full mt-4" onClick={() => handleNextStep(Step + 1)}>
                                {Step < 3 ? "Next" : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </Root>
        );
}
