import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface QRCodeGuideProps {
  url: string;
  setQRCodeMode: Function;
}
const QRCodeGuide = ({ url, setQRCodeMode }: QRCodeGuideProps) => {
  if (!url) return <></>;
  return (
    <>
      <Typography>Scan this QR using Google Authenticator</Typography>
      {url && <Image src={url} alt="qr-code" width={200} height={200} />}
      <Typography
        sx={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={() => setQRCodeMode(false)}
      >
        Can’t scan it?
      </Typography>
    </>
  );
};

export default QRCodeGuide;
