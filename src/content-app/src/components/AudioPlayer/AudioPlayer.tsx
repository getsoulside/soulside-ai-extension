// import { useEffect, useRef, useState } from "react";
// import { fetchRemoteFileDataUrl } from "@/utils/helpers";

interface AudioPlayerProps {
  url: string;
}

const AudioPlayer = ({ url }: AudioPlayerProps) => {
  // const [audioSrc, setAudioSrc] = useState<string | null>(null);
  // // const [isLoading, setIsLoading] = useState(true);
  // // const [error, setError] = useState(null);
  // const blobUrlRef = useRef<string | null>(null);

  // useEffect(() => {
  //   fetchAudioData();
  //   // Cleanup function
  //   return () => {
  //     // Revoke the Blob URL when component unmounts
  //     if (blobUrlRef.current) {
  //       URL.revokeObjectURL(blobUrlRef.current);
  //     }
  //   };
  // }, [url]);

  // const fetchAudioData = async () => {
  //   if (!url) return;
  //   // setIsLoading(true);
  //   // setError(null);
  //   try {
  //     const response = await fetchRemoteFileDataUrl(url);
  //     console.log("response", response);
  //     if (response?.audioData) {
  //       //log file size
  //       console.log("file size", response.audioData.size);
  //       const blob = new Blob([response.audioData], { type: response.type });
  //       const blobUrl = URL.createObjectURL(blob);
  //       blobUrlRef.current = blobUrl;
  //       console.log("blobUrl", blobUrl);
  //       setAudioSrc(blobUrl);
  //     } else {
  //       // setError(response.error || 'Failed to load audio');
  //     }
  //   } catch (error) {
  //     console.error("Error fetching audio data:", error);
  //   }
  //   // setIsLoading(false);
  // };

  return (
    <audio
      controls
      style={{
        backgroundColor: "#ddd",
        height: "40px",
        borderRadius: "30px",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
      }}
    >
      <source
        src={url || ""}
        type="audio/wav"
      />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
