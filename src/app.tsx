import React, { useState } from "react";
import {
  getTitleEscrowAddress,
  fetchEndorsementChain,
  encrypt,
} from "@trustvc/trustvc";
import { ethers, Signer } from "ethers";
import EndorsementChain from "./endorsementChain";
import AssetManagement from "./assetManagement";
import TitleEscrowAbi from "./abi/TitleEscrow.json";

const App: React.FC = () => {
  const [hasAttemptedUpload, setHasAttemptedUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState<string>(""); //connected metamask account

  const [signer, setSigner] = useState<Signer | null>(null); // Signer created from provider to sign the action transaction
  const [newHolder, setNewHolder] = useState<string>(""); // New entered value in the input holder field
  const [newBeneficiary, setNewBeneficiary] = useState<string>(""); // New entered value in the input beneficiary field
  const [titleEscrowAddress, setTitleEscrowAddress] = useState<string>(""); // title escrow address retrieved from the document
  const [holder, setHolder] = useState<string>(""); // holder address retrieved from the document's titleEscrow contract
  const [prevHolder, setPrevHolder] = useState<string>(""); // previous holder address retrieved from the document's titleEscrow contract
  const [beneficiary, setBeneficiary] = useState<string>(""); // beneficiary address retrieved from the document's titleEscrow contract
  const [prevBeneficiary, setPrevBeneficiary] = useState<string>(""); // previous beneficiary address retrieved from the document's titleEscrow contract
  const [endorsementChain, setEndorsementChain] = useState<Array<any>>([]); // endorsement chain retrieved from the document's titleEscrow contract
  const [remarks, setRemarks] = useState<string>(""); // Remarks entered in the input field while making an action
  const [encryptionId, setEncryptionId] = useState<string>(""); // used to encrypt the remarks
  const [nominee, setNominee] = useState<string>(""); // nominee address retrieved from the document's titleEscrow contract
  const connectWallet = async () => {
    const { ethereum, web3 } = window as any;
    if (ethereum) {
      try {
        const injectedWeb3 = ethereum || (web3 && web3.currentProvider);
        const newProvider = new ethers.providers.Web3Provider(
          injectedWeb3,
          "any"
        );
        await ethereum.request({ method: "eth_requestAccounts" });
        const _signer = newProvider.getSigner();
        setSigner(_signer);
        const address = await _signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install it to use this feature."
      );
    }
  };

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setHasAttemptedUpload(true);
    setIsLoading(true);

    const file = event.dataTransfer.files[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      const fileContent = await file.text();
      const vc = JSON.parse(fileContent);
      const rpc =
        "https://polygon-amoy.infura.io/v3/f724c79c65a74253a6bdb6c0d6a1cc27";
      //   const rpc =
      //     "https://sepolia.infura.io/v3/f724c79c65a74253a6bdb6c0d6a1cc27";
      const _provider = new ethers.providers.JsonRpcProvider(rpc);
      if (!_provider) return;
      const titleEscrowAddress = await getTitleEscrowAddress(
        vc.credentialStatus.tokenRegistry,
        "0x" + vc.credentialStatus.tokenId,
        _provider
      );
      const contract = new ethers.Contract(
        titleEscrowAddress,
        TitleEscrowAbi,
        _provider
      );
      setHolder(await contract.holder());
      setBeneficiary(await contract.beneficiary());
      setPrevHolder(await contract.prevHolder());
      setPrevBeneficiary(await contract.prevBeneficiary());
      setTitleEscrowAddress(titleEscrowAddress);
      setEncryptionId(vc.id);
      setNominee(await contract.nominee());

      //fetch endorsement chain
      const _endorsementChain = await fetchEndorsementChain(
        vc.credentialStatus.tokenRegistry,
        "0x" + vc.credentialStatus.tokenId,
        _provider as any,
        vc.id
      );
      console.log("Endorsement Chain", _endorsementChain);
      setEndorsementChain(_endorsementChain as any);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function handleAction(action: string) {
    // Request access to MetaMask
    if (!signer) {
      return;
    }

    // Connect to the contract
    const contract = new ethers.Contract(
      titleEscrowAddress,
      TitleEscrowAbi,
      signer
    );

    const encryptedRemark = "0x" + encrypt(remarks, encryptionId);
    console.log("encrypted remark", encryptedRemark);

    let params: string[] = [];
    if (action === "transferHolder") {
      if (!ethers.utils.isAddress(newHolder)) {
        console.error("Invalid Ethereum address:", newHolder);
        return;
      }
      params = [newHolder, encryptedRemark];
    } else if (action === "transferBeneficiary") {
      if (!ethers.utils.isAddress(newBeneficiary)) {
        console.error("Invalid Ethereum address:", newBeneficiary);
        return;
      }
      params = [newBeneficiary, encryptedRemark];
    } else if (action === "nominate") {
      if (!ethers.utils.isAddress(newBeneficiary)) {
        console.error("Invalid Ethereum address:", newBeneficiary);
        return;
      }
      params = [newBeneficiary, encryptedRemark];
    } else if (action === "transferOwners") {
      if (
        !ethers.utils.isAddress(newBeneficiary) ||
        !ethers.utils.isAddress(newHolder)
      ) {
        console.error("Invalid Ethereum address:", newBeneficiary, newHolder);
        return;
      }
      params = [newHolder, newBeneficiary, encryptedRemark];
    } else {
      params = [encryptedRemark];
    }

    try {
      const tx = await contract[action](...params);
      console.log("Transaction sent:", tx.hash);

      // Wait for transaction confirmation
      await tx.wait();
      console.log("Transaction confirmed");
    } catch (error) {
      console.error("Error calling transferHolder:", error);
    }
  }
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const actionButtons = [
    {
      btnName: "Transfer Holder",
      action: "transferHolder",
      show: holder === account,
    },
    {
      btnName: "Nominate Beneficiary",
      action: "nominate",
      show: beneficiary === account,
    },
    {
      btnName: "Endorse Beneficiary",
      action: "transferBeneficiary",
      show: holder === account && nominee !== zeroAddress,
    },
    {
      btnName: "Transfer Owners",
      action: "transferOwners",
      show: holder === account && beneficiary === account,
    },
    {
      btnName: "Reject Transfer Holder",
      action: "rejectTransferHolder",
      show:
        holder === account &&
        prevHolder !== zeroAddress &&
        holder !== beneficiary,
    },
    {
      btnName: "Reject Transfer Beneficiary",
      action: "rejectTransferBeneficiary",
      show:
        beneficiary === account &&
        prevBeneficiary !== zeroAddress &&
        holder !== beneficiary,
    },
    {
      btnName: "Reject Transfer Owners",
      action: "rejectTransferOwners",
      show:
        holder === beneficiary &&
        holder === account &&
        prevHolder !== zeroAddress &&
        prevBeneficiary !== zeroAddress,
    },
    {
      btnName: "Return to Issuer",
      action: "returnToIssuer",
      show: beneficiary === account && holder === account,
    },
  ];

  return (
    <div>
      <div
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <button onClick={connectWallet}>
          {account
            ? `Connected: ${account?.slice(0, 6)}...${account.slice(-4)}`
            : "Connect MetaMask"}
        </button>
      </div>
      {account && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1>Drop Document</h1>
          <p>Drop a Verifiable Credential file here </p>

          {isLoading && (
            <div className="spinner">Loading Endorsement Chain...</div>
          )}

          {hasAttemptedUpload && !isLoading && !endorsementChain && (
            <p style={{ color: "red" }}>Can not Load Endorsement Chain.</p>
          )}
        </div>
      )}
      <AssetManagement
        titleEscrowAddress={titleEscrowAddress}
        holder={holder}
        beneficiary={beneficiary}
        newHolder={newHolder}
        newBeneficiary={newBeneficiary}
        prevBeneficiary={prevBeneficiary}
        prevHolder={prevHolder}
        nominee={nominee}
        remarks={remarks}
        setNewHolder={setNewHolder}
        setNewBeneficiary={setNewBeneficiary}
        setRemarks={setRemarks}
        handleAction={handleAction}
        actionButtons={actionButtons}
      />

      <EndorsementChain endorsementChain={endorsementChain} />
    </div>
  );
};

export default App;
