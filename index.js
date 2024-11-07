let web3;
let contract;
const contractAddress = '0x880e32Bab702dD71dB3B82e4F03B23986482F2Aa'; // Replace with your contract's address
const contractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getMessage",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "newMessage", "type": "string"}],
        "name": "setMessage",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Connect wallet
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            contract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Connected to MetaMask!");
            alert("Wallet connected successfully!");
        } catch (error) {
            if (error.code === 4001) {
                alert("You need to allow MetaMask connection to continue.");
            } else {
                console.error("Error connecting to wallet:", error);
                alert("An error occurred while connecting to the wallet.");
            }
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Send message to the contract
async function sendMessage() {
    if (!web3 || !contract) {
        alert("Please connect your wallet first!");
        return;
    }

    const message = document.getElementById("messageInput").value;
    if (!message) {
        alert("Please enter a message!");
        return;
    }

    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.setMessage(message).send({ from: accounts[0] });
        alert("Message sent to the blockchain!");
        // getMessage(); // Fetch the updated message
    } catch (error) {
        if (error.code === 4001) {
            alert("Transaction was done by the user.");
            document.getElementById("message").innerText = message+"\n A transaction of 0.00 ETH was done!";
        } else {
            console.error("Error sending message:", error);
            alert("An error occurred while sending the message.");
        }
    }
}

// Get the message from the contract
async function getMessage() {
    if (!contract) {
        console.error("Contract is not initialized. Connect the wallet first.");
        return;
    }
    try {
        const message = await contract.methods.getMessage().call();
        document.getElementById("message").innerText = message;
    } catch (error) {
        console.error("Error fetching message:", error);
        alert("An error occurred while fetching the message.");
    }
}
