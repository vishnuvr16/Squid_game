import QRCode from "qrcode";

export const generateQRCode = async (url) => {
    try {
        return await QRCode.toDataURL(url);
    } catch (err) {
        console.error("Error generating QR Code", err);
    }
};
