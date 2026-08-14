import React, { useState } from 'react';
import { Lock, CheckCircle2, Copy, ShieldAlert } from 'lucide-react';

interface BlockchainBadgeProps {
  txHash?: string;
  networkName?: string;
}

export const BlockchainBadge: React.FC<BlockchainBadgeProps> = ({
  txHash = "TX_0x9f8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c",
  networkName = "Hyperledger Fabric (Sim)"
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunset-50 hover:bg-sunset-100 border border-sunset-200 text-sunset-600 text-xs font-semibold tracking-wide transition-all duration-300 shadow-xs hover:scale-105"
        title="Click to view Cryptographic Immutable Ledger Audit"
      >
        <Lock className="w-3.5 h-3.5 text-sunset-500" />
        <span>BLOCKCHAIN VERIFIED</span>
        <CheckCircle2 className="w-3.5 h-3.5 text-sunset-500" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md animate-fade-in">
          <div className="glass-card-strong p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-sunset-100 pb-3">
              <div className="flex items-center gap-2 text-sunset-600 font-display font-bold text-lg">
                <Lock className="w-5 h-5" />
                <span>Cryptographic Access Record</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-mutedgray hover:text-charcoal text-sm px-2 py-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-charcoal">
              <div>
                <span className="text-xs text-mutedgray uppercase font-semibold block">Consensus Network</span>
                <span className="text-charcoal font-bold">{networkName}</span>
              </div>

              <div>
                <span className="text-xs text-mutedgray uppercase font-semibold block">Immutable Transaction Hash</span>
                <div className="flex items-center justify-between bg-white/80 p-3 rounded-2xl border border-sunset-100 text-xs font-mono text-sunset-600 mt-1">
                  <span className="truncate mr-2">{txHash}</span>
                  <button onClick={handleCopy} className="text-mutedgray hover:text-charcoal p-1">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-sunset-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-sunset-50/70 p-3.5 rounded-2xl border border-sunset-100 text-xs text-charcoal space-y-1">
                <div className="flex items-center gap-1.5 text-sunset-600 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Tamper-Proof Audit Guarantee</span>
                </div>
                <p className="text-mutedgray">This transaction log is cryptographically signed and linked to the patient's zero-knowledge consent policy.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 btn-sunset-glass text-xs"
              >
                Close Audit Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
