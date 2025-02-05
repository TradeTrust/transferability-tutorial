import React, { Dispatch, Key, SetStateAction, useState } from "react";

type AssetManagementProps = {
  titleEscrowAddress: string;
  holder: string;
  beneficiary: string;
  newHolder: string;
  newBeneficiary: string;
  prevBeneficiary: string;
  prevHolder: string;
  nominee: string;
  remarks: string;
  setNewHolder: Dispatch<SetStateAction<string>>;
  setNewBeneficiary: Dispatch<SetStateAction<string>>;
  setRemarks: Dispatch<SetStateAction<string>>;
  handleAction: (action: string) => Promise<void>;
  actionButtons: any[];
};
const AssetManagement: React.FC<AssetManagementProps> = ({
  titleEscrowAddress,
  holder,
  beneficiary,
  newHolder,
  newBeneficiary,
  prevBeneficiary,
  prevHolder,
  nominee,
  remarks,
  setNewHolder,
  setNewBeneficiary,
  setRemarks,
  handleAction,
  actionButtons,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  return (
    <>
      {holder && beneficiary && (
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "10px",
            textAlign: "center",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "left", fontSize: "15px" }}>
            <p>
              <strong>Title Escrow</strong> : {titleEscrowAddress}
            </p>
            <p>
              <strong>Holder : </strong> {holder}
            </p>
            <p>
              <strong>Beneficiary : </strong> {beneficiary}
            </p>
            <p>
              <strong>Nominee : </strong>
              {nominee}
            </p>
            <p>
              <strong>Previous Beneficiary : </strong> {prevBeneficiary}
            </p>
            <p>
              <strong>Previous Holder : </strong> {prevHolder}
            </p>
            <p style={{ fontSize: "12px", fontWeight: "bold" }}>
              Note* - The previous beneficiary and holder are the addresses from
              the most recent transfer of the holder, beneficiary, or both.
              Their presence determines whether the reject action is available
              for this transfer.
            </p>
          </div>
          <div>
            <div
              style={{
                padding: "20px",
                width: "800px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="New Holder"
                value={newHolder}
                onChange={(e) => setNewHolder(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "5px",
                  marginRight: "10px",
                }}
              />
              <input
                type="text"
                placeholder="New Beneficiary"
                value={newBeneficiary}
                onChange={(e) => setNewBeneficiary(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "5px",
                  marginRight: "10px",
                }}
              />
              <input
                type="text"
                placeholder="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                  padding: "5px",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "right",
                alignItems: "right",
                paddingRight: "20px",
              }}
            >
              <button
                style={{ padding: "10px", width: "30%" }}
                onClick={() => setDropdownVisible(!dropdownVisible)}
              >
                Action
              </button>
              {dropdownVisible && (
                <div
                  style={{
                    position: "absolute",
                    padding: "2px",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    width: "30%",
                    marginTop: "40px",
                  }}
                >
                  {actionButtons.map((actionButton: any, index: Key) => {
                    return (
                      actionButton.show && (
                        <button
                          key={index}
                          onClick={() => handleAction(actionButton.action)}
                          style={{
                            width: "100%",
                            padding: "5px",
                          }}
                        >
                          {actionButton.btnName}
                        </button>
                      )
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetManagement;
