import React from "react";
interface EndorsementChainProps {
  endorsementChain: any[]; // add the endorsementChain prop
}

const EndorsementChain: React.FC<EndorsementChainProps> = ({
  endorsementChain,
}) => {
  const actionMessage = {
    INITIAL: "Document has been issued",
    NOMINATE: "Nomination of new beneficiary",
    REJECT_TRANSFER_BENEFICIARY: "Rejection of beneficiary",
    REJECT_TRANSFER_HOLDER: "Rejection of holdership",
    REJECT_TRANSFER_OWNERS: "Rejection of owners",
    RETURN_TO_ISSUER_ACCEPTED: "Return to issuer accepted",
    RETURN_TO_ISSUER_REJECTED: "Return to issuer rejected",
    RETURNED_TO_ISSUER: "Returned to issuer",
    SURRENDER_ACCEPTED: "Return to issuer accepted",
    SURRENDER_REJECTED: "Return to issuer rejected",
    SURRENDERED: "Returned to issuer",
    TRANSFER_BENEFICIARY: "Transfer beneficiary",
    TRANSFER_HOLDER: "Transfer holdership",
    TRANSFER_OWNERS: "Trnasfer beneficiary and holdership"
  };
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    endorsementChain.length > 0 && (
      <div
        style={{
          overflowX: "auto",
          padding: "26px",
          border: "2px dashed #ccc",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <table style={{ width: "85%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid black" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Action/Date</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Owner</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Holder</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {endorsementChain.map(
              (action: {
                type: keyof typeof actionMessage;
                timestamp: number;
                owner: string;
                holder: string;
                remark: string;
              }) => (
                <tr style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "8px" }}>
                    {actionMessage[action.type]}
                    <br />
                    <span style={{ color: "grey", fontSize: "12px" }}>
                      {formatDate(action.timestamp)}
                    </span>
                  </td>
                  <td style={{ padding: "8px" }}>{action.owner}</td>
                  <td style={{ padding: "8px" }}>{action.holder}</td>
                  <td style={{ padding: "8px" }}>{action.remark}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    )
  );
};
export default EndorsementChain;
