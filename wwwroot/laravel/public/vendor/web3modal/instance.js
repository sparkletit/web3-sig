"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.EvmChains;
const Fortmatic = window.Fortmatic;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;


/**
 * Setup the orchestra
 */
function init() {
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // Mikko's test key - don't copy as your mileage may vary
                infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
            },
        },
        fortmatic: {
            package: Fortmatic,
            options: {
                // Mikko's TESTNET api key
                key: "pk_test_391E26A3B43A3350",
            },
        },
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
    });
}

function formatAccount(account) {
    const prefix = account.substring(0, 5);
    const postfix = account.substring(account.length - 5);
    return `${prefix}...${postfix}`;
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {
    // Get a Web3 instance for the wallet
    const web3 = new Web3(window.ethereum);

    // console.log("Web3 instance is", web3);

    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    //   const chainData = await EvmChains.getChain(chainId);
    //   document.querySelector("#network-name").textContent = chainData.name;

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account

    selectedAccount = accounts[0];

    document.querySelector("#btn-disconnect").textContent =
        formatAccount(selectedAccount);
    localStorage.setItem("account", selectedAccount);
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "";
}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {
    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    document.querySelector("#connected").style.display = "none";
    document.querySelector("#prepare").style.display = "";

    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled");
    await fetchAccountData(provider);
    document.querySelector("#btn-connect").removeAttribute("disabled");
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {
    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });

    await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {
    // // TODO: Which providers have close method?
    //  if (provider) {
    await web3Modal.clearCachedProvider();
    // }
    localStorage.removeItem("account");
    // Set the UI back to the initial state
    document.querySelector("#prepare").style.display = "";
    document.querySelector("#connected").style.display = "none";
}

/**
 * Main entry point.
 */
window.addEventListener("load", async () => {
    if (window.location.pathname == "/admin/permit-collections") {
        if (localStorage.getItem("account") != undefined) {
            refreshAccountData();
        }

        init();
        document
            .querySelector("#btn-connect")
            .addEventListener("click", onConnect);
        document
            .querySelector("#btn-disconnect")
            .addEventListener("click", onDisconnect);
    }
});
