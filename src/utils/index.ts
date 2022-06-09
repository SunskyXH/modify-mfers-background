import axios from "axios";

const IPFS_GATEWAY_PREFIX = "https://infura-ipfs.io";

export const IPFSFormatter = (IPFS_URI: string) => {
  const suffix = IPFS_URI.split("ipfs://")[1];
  return `${IPFS_GATEWAY_PREFIX}/ipfs/${suffix}`;
};

export const IPFSImageFormatter = async (IPFS_URI: string) => {
  const metadata = IPFSFormatter(IPFS_URI);

  const res = await axios.get(metadata);

  const imageURI = res.data.image;
  return IPFSFormatter(imageURI);
};
