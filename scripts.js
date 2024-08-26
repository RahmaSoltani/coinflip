const contractAddress = '0xd2EF558b96aF1f4867b25c7038762159D4307DB7'; // Replace with your contract address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "chosenSide",
                "type": "bool"
            }
        ],
        "name": "flipCoin",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bool",
                "name": "result",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "userGuess",
                "type": "bool"
            }
        ],
        "name": "FlipResult",
        "type": "event"
    }
]; // Replace with your contract ABI

let provider;
let signer;
let contract;
let userGuess;
let amount;
let transactionData = null; // Store transaction data to complete later
let resultShown = false; // Flag to track if result alert has been shown

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        try {
            await provider.send("eth_requestAccounts", []);
            const address = await signer.getAddress();
            showAlert('Connected: ' + address, 'connected');
        } catch (error) {
            showAlert('Connection to MetaMask failed.', 'error');
            console.error('Connection to MetaMask failed:', error);
        }
    } else {
        showAlert('Please install MetaMask!', 'error');
    }
}

async function flipCoin() {
    userGuess = document.querySelector('input[name="guess"]:checked').value === 'true';
    amount = document.getElementById('amount').value;

    if (isNaN(amount) || amount <= 0) {
        showAlert('Please enter a valid amount!', 'error');
        return;
    }

    // Simulate coin flip
    const result = Math.random() > 0.5;
    const resultText = result === userGuess
        ? `You won! The coin landed on ${result ? 'Heads' : 'Tails'}.`
        : `You lost. The coin landed on ${result ? 'Heads' : 'Tails'}.`;

    // Play flip animation
    const coin = document.getElementById('coin');
    coin.style.animation = result ? 'spin-heads 2s forwards' : 'spin-tails 2s forwards';

    // Play flip sound
    const coinFlipSound = document.getElementById('coinFlipSound');
    coinFlipSound.play();

    // Ensure the result alert is shown after the animation
    setTimeout(() => {
        showAlert(`The coin landed on ${result ? 'Heads' : 'Tails'}. ${result === userGuess ? 'Congratulations! You won!' : 'You lost!'}`, 'result');
        // Prepare transaction data
        if (signer) {
            const houseAddress = contractAddress; // Use contract address
            transactionData = {
                to: houseAddress,
                value: ethers.utils.parseEther(amount.toString())
            };
            resultShown = true; // Set the flag to indicate the result has been shown
        }
    }, 2000); // This should match the duration of your flip animation
}

function showAlert(message, type) {
    const alertCard = document.getElementById('alertCard');
    const alertMessage = document.getElementById('alertMessage');
    alertCard.className = `alert ${type}`;
    alertMessage.textContent = message;
    alertCard.classList.add('show');
}

function closeAlert() {
    const alertCard = document.getElementById('alertCard');
    alertCard.classList.remove('show');

    // If result was shown and transaction data is available, complete the transaction
    if (resultShown && transactionData) {
        completeTransaction();
    }

    // Reset the flags
    resultShown = false;
    transactionData = null;
}

async function completeTransaction() {
    try {
        if (signer && transactionData) {
            const transaction = await signer.sendTransaction(transactionData);
            showAlert('Transaction completed successfully!', 'result');
            console.log('Transaction successful:', transaction);
        }
    } catch (error) {
        showAlert('Transaction failed. Please try again.', 'error');
        console.error('Transaction failed:', error); // Log detailed error to console
    }
}

// Close alert on click
document.getElementById('alertCard').addEventListener('click', closeAlert);