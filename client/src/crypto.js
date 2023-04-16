import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

const wallets = new Map(
    [
        [
            "default", 
            { 
                publicKey: "043b8b24a07aa62547ec8346ca1ebd2fcdc8070d81984fab31b68e23d9fadfe22d2ecafa8bb1fa51b98bdd4915afeb7b38f7ecaf6f69d38e11f99c74664d92e638", 
                privateKey: "4e39d9504a5824d0dbfd19bc2103d858fcef9b634a523de7d6ae7c7a745b910f",
            }
        ]
    ]
);   

const hashMessage = (message) => keccak256(Uint8Array.from(message));

const getPublicKey = (user) => {
  if (!user) return null;
  return hexToBytes(wallets.get(user).publicKey);
};

const getPrivateKey = (user) => {
  if (!user) return null;
  return hexToBytes(wallets.get(user).privateKey);
};

const getAddress = (user) => {
  if (!user) return null; 
  const pubKey = getPublicKey(user);
  const hash = keccak256(pubKey.slice(1));
  return toHex(hash.slice(-20)).toUpperCase();
};

const getHexPubKey = (user) => {
  if (!user) return null;
  return toHex(getPublicKey(user)).toUpperCase();
};

const sign = async (username, message) => {
  const privateKey = getPrivateKey(username);
  const hash = hashMessage(message);

  const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
    recovered: true,
  });
  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
};

const addNewWallet = (walletName) => {
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKey = toHex(secp.getPublicKey(privateKey));

    wallets.set(walletName, { publicKey: publicKey, privateKey: privateKey });
}

const crypto = {
  wallets,
  sign,
  getAddress,
  getHexPubKey,
  addNewWallet,
};
export default crypto;