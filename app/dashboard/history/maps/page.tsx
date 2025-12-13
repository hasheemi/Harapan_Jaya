"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import dynamic from "next/dynamic";
import Image from "next/image";
import "leaflet/dist/leaflet.css"; 

function CampaignInfo({ campaign }: { campaign: any }) {
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");

  useEffect(() => {
    // Fetch deskripsi HTML dari URL jika ada
    const fetchDescription = async () => {
      if (campaign.deskripsi_url) {
        try {
          const response = await fetch(campaign.deskripsi_url);
          if (response.ok) {
            const htmlContent = await response.text();
            setDescriptionHtml(htmlContent);
          }
        } catch (error) {
          console.error("Error fetching description:", error);
        }
      }
    };

    fetchDescription();
  }, [campaign.deskripsi_url]);

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-6 flex flex-row justify-between">
          {/* Image Section */}
          <div className="mb-6">
            <Image
              src={campaign.poster_url || "/assets/img/item/sinarmas.jpeg"}
              alt={campaign.judul}
              width={800}
              height={400}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Kampanye
              </label>
              <h3 className="text-2xl font-bold">{campaign.judul}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Donasi
              </label>
              <h3 className="text-xl">
                Rp{(campaign.target_donasi * 15000)?.toLocaleString() || 0}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <h3 className="text-xl">{campaign.lokasi}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Medan
              </label>
              <h3 className="text-xl">{campaign.medan || "-"}</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Pohon
              </label>
              <h3 className="text-xl">
                {campaign.jenis_pohon_asli || campaign.jenis_pohon || "-"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Planning
              </label>
              <h3 className="text-xl">
                {campaign.tanggal_planning
                  ? new Date(campaign.tanggal_planning).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                  : "-"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <h3 className="text-xl">
                {campaign.tanggal_mulai
                  ? new Date(campaign.tanggal_mulai).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                  : "-"}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir
              </label>
              <h3 className="text-xl">
                {campaign.tanggal_berakhir
                  ? new Date(campaign.tanggal_berakhir).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )
                  : "-"}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {descriptionHtml ? (
              <div
                className="text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <p className="text-sm text-gray-500">Deskripsi tidak tersedia</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  // == Fungsi Mengambil Data ===
  const [userDonations, setUserDonations] = useState<any[]>([]);
  const [campaignsData, setCampaignsData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonationIndex, setSelectedDonationIndex] = useState<number | null>(null);

  // Ambil data user dari localStorage
  const [localData, setLocalData] = useState<any>(null);

  useEffect(() => {
    // Ambil data user dari localStorage
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsedData = JSON.parse(stored);
        setLocalData(parsedData);
      }
    } catch (err) {
      console.warn("LocalStorage parse failed:", err);
    }
  }, []);

  // Ambil data donasi user dari Firebase
  useEffect(() => {
    const fetchUserDonations = async () => {
      if (!localData?.email) return;

      setIsLoading(true);
      try {
        const transactionsRef = collection(db, "transactionsv2");
        const q = query(
          transactionsRef,
          where("user_email", "==", localData.email),
          orderBy("created_at", "desc"),
          limit(6)
        );

        const querySnapshot = await getDocs(q);
        const donations: any[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          donations.push({
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate?.() || null,
          });
        });

        setUserDonations(donations);

        // Fetch campaign data for each donation
        const campaignPromises = donations.map(async (donation) => {
          if (donation.campaign_id) {
            try {
              const campaignsRef = collection(db, "campaignsv2");
              const q = query(campaignsRef, where("id", "==", donation.campaign_id)); // atau field name yang sesuai
              const querySnapshot = await getDocs(q);

              if (!querySnapshot.empty) {
                const campaignDoc = querySnapshot.docs[0];
                return {
                  campaignId: donation.campaign_id,
                  data: campaignDoc.data()
                };
              }
            } catch (error) {
              console.error(`Error fetching campaign ${donation.campaign_id}:`, error);
            }
          }
          return null;
        });

        const campaigns = await Promise.all(campaignPromises);
        const campaignMap: any = {};
        campaigns.forEach(campaign => {
          if (campaign) {
            campaignMap[campaign.campaignId] = campaign.data;
          }
        });

        setCampaignsData(campaignMap);

        // Select the first donation by default if available
        if (donations.length > 0) {
          setSelectedDonationIndex(0);
        }
      } catch (error) {
        console.error("Error fetching user donations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDonations();
  }, [localData?.email]);

  // Generate map points from campaigns data
  const mapPoints = userDonations.map((donation) => {
    const campaign = campaignsData[donation.campaign_id];
    console.log(campaignsData);
    return {
      lat: campaign?.lokasi_lat || donation.latitude || donation.coords?.[0] || -6.200000,
      lng: campaign?.lokasi_lng || donation.longitude || donation.coords?.[1] || 106.816666,
      id: donation.id,
      campaignId: donation.campaign_id
    };
  });

  console.log("User donations:", userDonations);
  console.log("Campaigns data:", campaignsData);
  console.log("Map points:", mapPoints);

  const handlePointClick = (index: number) => {
    setSelectedDonationIndex(index);
    const donation = userDonations[index];
    if (donation) {
      const campaign = campaignsData[donation.campaign_id];
      if (campaign?.lokasi_lat && campaign?.lokasi_lng) {
        setCoords([campaign.lokasi_lat, campaign.lokasi_lng]);
      } else if (donation.latitude && donation.longitude) {
        setCoords([donation.latitude, donation.longitude]);
      } else if (donation.coords) {
        setCoords(donation.coords);
      }
    }
  };

  const selectedDonation = selectedDonationIndex !== null ? userDonations[selectedDonationIndex] : null;
  const selectedCampaign = selectedDonation ? campaignsData[selectedDonation.campaign_id] : null;

  // == Fungsi Peta ==
  const [coords, setCoords] = useState<[number, number] | null>(null);

  const LeafletMap = dynamic(() => import("../../../test/map/leafletMap"), {
    ssr: false,
  });

  return (
    <>
      <div className="flex flex-col md:flex-row  md:items-center gap-4">
        <Link href="/dashboard/history">
          <button className="px-2 hover:bg-green-400 border-2 border-gray-300 py-2"><i className="bx bx-arrow-back"></i></button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Peta Sebaran Donasi</h1>
        </div>
      </div>
      {/* Map */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lokasi Donasi
          {selectedCampaign && (
            <span className="text-sm text-green-600 ml-2">
              - {selectedCampaign.judul || selectedDonation?.campaign_title || "Donasi Terpilih"}
            </span>
          )}
        </label>
        <div className="h-[400px] mb-4 border rounded-lg overflow-hidden">
          <LeafletMap
            coords={coords}
            setCoords={setCoords}
            points={mapPoints}
            onPointClick={handlePointClick}
          />
        </div>
      </div>

      {/* Description */}
      {selectedCampaign ? (
        <div className="p-4 text-black flex md:flex-row flex-col gap-4">
          <CampaignInfo campaign={selectedCampaign} />
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          Pilih lokasi pada peta untuk melihat detail donasi.
        </div>
      )}
    </>
  );
}