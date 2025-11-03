const { ethers } = window.ethers;

// ======================= GLOBAL VARIABLES =======================
let provider;
let signer;
let contract;

// ======================= LOAD CONTRACT DATA =======================
async function loadContractData() {
  try {
    const addressResponse = await fetch("./contracts/contract-address.json");
    const contractAddress = await addressResponse.json();

    const abiResponse = await fetch("./contracts/DrugSupplyChain.json");
    const DrugSupplyChain = await abiResponse.json();

    window.contractAddressValue = contractAddress.DrugSupplyChain;
    window.contractABI = DrugSupplyChain.abi;

    console.log("✅ Contract data loaded");
  } catch (err) {
    console.error("❌ Failed to load contract data:", err);
    alert("❌ Failed to load contract data. Check your file paths.");
  }
}

// ======================= CONNECT METAMASK WALLET =======================
// async function connectWallet() {
//   if (!window.ethereum) {
//     alert("🦊 Please install MetaMask!");
//     return;
//   }

//   try {
//     console.log("🦊 MetaMask detected");

//     provider = new ethers.BrowserProvider(window.ethereum);
//     signer = await provider.getSigner();
//     const network = await provider.getNetwork();
//     console.log("🌐 Connected Network:", network.name, "Chain ID:", network.chainId);


//     const address = await signer.getAddress();

//     // ✅ Ensure ABI & Address are loaded
//     if (!window.contractAddressValue || !window.contractABI) {
//       await loadContractData();
//     }

//     contract = new ethers.Contract(window.contractAddressValue, window.contractABI, signer);

//     // ✅ Make globals (for console debugging)
//     window.provider = provider;
//     window.signer = signer;
//     window.contract = contract;

//     console.log("✅ Connected as:", address);
//     console.log("✅ Contract:", contract.target);

//     document.getElementById("connectBtn").innerText =
//       `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;

//     alert("✅ MetaMask connected successfully!");
//   } catch (error) {
//     console.error("❌ MetaMask connection failed:", error);
//     alert("❌ MetaMask connection failed!");
//   }
// }

// ======================= CONNECT METAMASK WALLET =======================
async function connectWallet() {
  if (!window.ethereum) {
    alert("🦊 Please install MetaMask!");
    return;
  }

  try {
    console.log("🦊 MetaMask detected");

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // 🔹 Get current network info
    const currentChain = await window.ethereum.request({ method: "eth_chainId" });
    console.log("🌐 Connected Network:", currentChain);

    // 🔹 Ensure user is on Sepolia (Chain ID: 11155111 → 0xaa36a7 in hex)
    const sepoliaChainId = "0xaa36a7";
    if (currentChain !== sepoliaChainId) {
      try {
        console.log("⚠️ Switching to Sepolia Test Network...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: sepoliaChainId }],
        });
        console.log("✅ Switched to Sepolia Test Network");
      } catch (switchError) {
        // If Sepolia is not added to MetaMask
        if (switchError.code === 4902) {
          console.log("➕ Adding Sepolia Test Network to MetaMask...");
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: sepoliaChainId,
                chainName: "Sepolia Test Network",
                rpcUrls: ["https://rpc.sepolia.org"],
                nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
          console.log("✅ Sepolia network added successfully");
        } else {
          throw switchError;
        }
      }
    }

    // ✅ Reload provider after switching network
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    const address = await signer.getAddress();

    // ✅ Ensure ABI & Address are loaded
    if (!window.contractAddressValue || !window.contractABI) {
      await loadContractData();
    }

    // ✅ Connect contract
    contract = new ethers.Contract(window.contractAddressValue, window.contractABI, signer);

    // ✅ Store globals for debugging
    window.provider = provider;
    window.signer = signer;
    window.contract = contract;

    console.log("✅ Connected as:", address);
    console.log("✅ Contract:", contract.target);

    document.getElementById("connectBtn").innerText =
      `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;

    alert("✅ MetaMask connected to Sepolia successfully!");
  } catch (error) {
    console.error("❌ MetaMask connection failed:", error);
    alert("❌ MetaMask connection failed! Check console for details.");
  }
}

// ======================= CREATE NEW BATCH =======================
// async function createBatch() {
//   const name = document.getElementById("batchName").value.trim();
//   const desc = document.getElementById("batchDesc").value.trim();
//   const mDate = document.getElementById("mDate").value;
//   const eDate = document.getElementById("eDate").value;

//   if (!name || !desc || !mDate || !eDate) {
//     alert("⚠️ Please fill all fields!");
//     return;
//   }

//   if (!window.contract) {
//     alert("❌ Contract not connected! Click 'Connect MetaMask' first.");
//     return;
//   }

//   try {
//     const mDateUnix = Math.floor(new Date(mDate).getTime() / 1000);
//     const eDateUnix = Math.floor(new Date(eDate).getTime() / 1000);

//     console.log("📦 Creating batch:", { name, desc, mDateUnix, eDateUnix });

//     // ✅ Force MetaMask popup — specify gasLimit manually
//     const tx = await window.contract.createBatch(name, desc, mDateUnix, eDateUnix, {
//       gasLimit: 300000,
//     });

//     console.log("⏳ Transaction sent:", tx.hash);
//     alert("⏳ Transaction submitted! Confirm it in MetaMask...");

//     // Wait for it to mine
//     const receipt = await tx.wait();
//     console.log("✅ Transaction confirmed:", receipt.transactionHash);
//     alert("✅ Batch created successfully!");
//   } catch (err) {
//     console.error("❌ Create Batch Error:", err);
//     alert(`❌ Transaction failed: ${err.reason || err.message}`);
//   }
// }

// async function createBatch() {
//   const name = document.getElementById("batchName").value.trim();
//   const desc = document.getElementById("batchDesc").value.trim();
//   const mDate = document.getElementById("mDate").value;
//   const eDate = document.getElementById("eDate").value;

//   if (!name || !desc || !mDate || !eDate) {
//     alert("⚠️ Please fill all fields!");
//     return;
//   }

//   if (!window.contract) {
//     alert("❌ Contract not connected! Click 'Connect MetaMask' first.");
//     return;
//   }

//   try {
//     const mDateUnix = Math.floor(new Date(mDate).getTime() / 1000);
//     const eDateUnix = Math.floor(new Date(eDate).getTime() / 1000);

//     console.log("📦 Creating batch:", { name, desc, mDateUnix, eDateUnix });

//     const tx = await window.contract.createBatch(name, desc, mDateUnix, eDateUnix);
//     console.log("⏳ Transaction sent:", tx.hash);

//     const receipt = await tx.wait();
//     console.log("✅ Transaction mined:", receipt);

//     // 🔎 Extract event from logs
//     const event = receipt.logs
//       .map(log => {
//         try { return window.contract.interface.parseLog(log); } catch (e) { return null; }
//       })
//       .filter(e => e && e.name === "BatchCreated")[0];

//     if (event) {
//       const batchId = event.args.batchId.toString();
//       console.log("🎉 New Batch Created with ID:", batchId);
//       alert(`✅ Batch created successfully! Your Batch ID is: ${batchId}`);

//       // Optional: Show on page
//       document.getElementById("batchResult").innerHTML =
//         `✅ Batch Created Successfully!<br>Your Batch ID: <b>${batchId}</b>`;
//     } else {
//       console.warn("⚠️ No BatchCreated event found in transaction logs.");
//     }

//   } catch (err) {
//     console.error("❌ Create Batch Error:", err);
//     alert(`❌ Transaction failed: ${err.reason || err.message}`);
//   }
// }

// ======================= CREATE NEW BATCH =======================
async function createBatch() {
  const name = document.getElementById("batchName").value.trim();
  const desc = document.getElementById("batchDesc").value.trim();
  const mDate = document.getElementById("mDate").value;
  const eDate = document.getElementById("eDate").value;

  if (!name || !desc || !mDate || !eDate) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  if (!window.contract) {
    alert("❌ Contract not connected! Click 'Connect MetaMask' first.");
    return;
  }

  try {
    const mDateUnix = Math.floor(new Date(mDate).getTime() / 1000);
    const eDateUnix = Math.floor(new Date(eDate).getTime() / 1000);

    console.log("📦 Creating batch:", { name, desc, mDateUnix, eDateUnix });

    // ✅ Send transaction to create the batch
    const tx = await window.contract.createBatch(name, desc, mDateUnix, eDateUnix, {
      gasLimit: 300000,
    });

    console.log("⏳ Transaction sent:", tx.hash);
    document.getElementById("batchResult").innerText = "⏳ Waiting for confirmation...";

    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed:", receipt.transactionHash);
    alert("✅ Batch created successfully!");

    // ✅ Fetch total batch count
    const count = await window.contract.batchCount();
    const newBatchId = Number(count) - 1;

    // ✅ Show batch ID in HTML
    document.getElementById("batchResult").innerText =
      `✅ Batch created successfully! Your Batch ID is: ${newBatchId}`;

    // ✅ Optionally clear form fields
    document.getElementById("batchName").value = "";
    document.getElementById("batchDesc").value = "";
    document.getElementById("mDate").value = "";
    document.getElementById("eDate").value = "";

    console.log(`🎉 New Batch Created: ID ${newBatchId}`);
  } catch (err) {
    console.error("❌ Create Batch Error:", err);
    document.getElementById("batchResult").innerText =
      `❌ Transaction failed: ${err.reason || err.message}`;
  }
}

// ======================= TRACK BATCH =======================
// async function trackBatch() {
//   const id = document.getElementById("batchId").value.trim();
//   if (!id) return alert("⚠️ Enter Batch ID!");

//   try {
//     const batch = await window.contract.batches(id);

//     document.getElementById("batchInfo").innerHTML = `
//       <div class="card">
//         <h3>${batch.name}</h3>
//         <p><strong>Description:</strong> ${batch.description}</p>
//         <p><strong>Manufactured:</strong> ${new Date(Number(batch.mfgDate) * 1000).toLocaleDateString()}</p>
//         <p><strong>Expires:</strong> ${new Date(Number(batch.expDate) * 1000).toLocaleDateString()}</p>
//         <p><strong>Owner:</strong> ${batch.owner}</p>
//       </div>
//     `;
//   } catch (err) {
//     console.error("❌ Track Error:", err);
//     alert("❌ Batch not found or contract error.");
//   }
// }

async function trackBatch() {
  const id = document.getElementById("batchId").value.trim();
  if (!id) return alert("⚠️ Enter Batch ID!");

  try {
    const batch = await window.contract.batches(id);

    // ✅ Show batch info
    document.getElementById("batchInfo").innerHTML = `
      <div class="card">
        <h3>${batch.name}</h3>
        <p><strong>Description:</strong> ${batch.description}</p>
        <p><strong>Manufactured:</strong> ${new Date(Number(batch.mfgDate) * 1000).toLocaleDateString()}</p>
        <p><strong>Expires:</strong> ${new Date(Number(batch.expDate) * 1000).toLocaleDateString()}</p>
        <p><strong>Owner:</strong> ${batch.owner}</p>
      </div>
    `;

    // 🕒 Auto-hide after 5 seconds
    setTimeout(() => {
      document.getElementById("batchInfo").innerHTML = "";
    }, 5000);

  } catch (err) {
    console.error("❌ Track Error:", err);
    alert("❌ Batch not found or contract error.");
  }
}


// // ======================= TRANSFER OWNERSHIP =======================
// async function transferBatch() {
//   const id = document.getElementById("transferId").value.trim();
//   const newOwner = document.getElementById("newOwner").value.trim();
//   if (!id || !newOwner) return alert("⚠️ Fill both fields!");

//   try {
//     const tx = await window.contract.transferBatch(id, newOwner);
//     await tx.wait();
//     alert("✅ Ownership transferred successfully!");
//   } catch (err) {
//     console.error("❌ Transfer failed:", err);
//     alert("❌ Transfer failed. Check console for details.");
//   }
// }

// ======================= VIEW ALL BATCHES =======================
async function viewAllBatches() {
  try {
    const count = await window.contract.batchCount();
    let html = "";

    for (let i = 0; i < Number(count); i++) {
      const b = await window.contract.batches(i);
      html += `
        <div class="card">
          <h3>${b.name}</h3>
          <p>${b.description}</p>
          <p><b>Owner:</b> ${b.owner}</p>
        </div>
      `;
    }

    // setTimeout(() => {
    //   document.getElementById("batchInfo").innerHTML = "";
    // }, 5000)

    document.getElementById("allBatches").innerHTML = html || "No batches found.";
  } catch (err) {
    console.error("❌ Could not fetch batches:", err);
    alert("❌ Could not fetch batches.");
  }
}

// ======================= INITIAL SETUP =======================
window.addEventListener("DOMContentLoaded", async () => {
  await loadContractData();
  document.getElementById("connectBtn").addEventListener("click", connectWallet);
  document.getElementById("createBtn").addEventListener("click", createBatch);
  document.getElementById("trackBtn").addEventListener("click", trackBatch);
  //document.getElementById("transferBtn").addEventListener("click", transferBatch);
  document.getElementById("viewAllBtn").addEventListener("click", viewAllBatches);
});

// ---------- Logout ----------
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
  // Optional: If using sessions, you can also hit your backend /logout route:
  fetch('http://localhost:5000/logout', {
    method: 'POST',
    credentials: 'include',
  }).finally(() => {
    // ✅ Clear local data and redirect to login
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = 'signin-signup.html';
  });
});
