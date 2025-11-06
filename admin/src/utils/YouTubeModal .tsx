"use client";

import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons"; //

type Props = {
    url: string;
};

export const YouTubeModal = ({ url }: Props) => {
    const [open, setOpen] = useState(false);

    if (!url) return <span className="text-gray-400">No video</span>;


    const videoIdMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative group cursor-pointer"
            >
                <div className="relative">
                    <iframe
                        width="120"
                        height="70"
                        src={`https://www.youtube.com/embed/${videoId}?controls=0&autoplay=0`}
                        title="YouTube preview"
                        className="rounded-md pointer-events-none" // 👈 pointer-events-none মানে ক্লিক iframe এ নয়, button এ হবে
                    ></iframe>

                    {/* hover effect */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-sm font-semibold">▶ Watch</span>
                    </div>
                </div>
            </button>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white p-4 rounded-xl shadow-xl max-w-3xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-2 right-3 text-red-500 hover:text-red-700 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition"
                        >
                            <CloseOutlined style={{ fontSize: "24px", fontWeight: 700 }} /> 
                        </button>
                        {videoId ? (
                            <div className="aspect-video">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                    title="YouTube video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-lg"
                                ></iframe>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">Invalid YouTube URL</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
