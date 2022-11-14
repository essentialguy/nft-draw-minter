import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./styles.css";
import { useSelector } from "react-redux"
import { ethers } from "ethers";
import axios from 'axios';

import contract from "../artifacts/contracts/NFTMinter.sol/NFTMinter.json";
import { contractAddress } from "../utils/contracts-config";

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const Dashboard = () => {
    const data = useSelector((state) => state.blockchain.value);
    const [nfts, setNfts] = useState([])

    async function getMyNfts() {
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(contractAddress, contract.abi, signer);
        const myNfts = await nftContract.getMyNfts()

        if (myNfts !== undefined) {
            const items = await Promise.all(
                myNfts.map(async (nft) => {
                    let metaData = await axios.get(nft[1])
                    let item = {
                        id: Number(nft[0]),
                        name: metaData.data.name,
                        image: metaData.data.image
                    }
                    return item
                })
            )
            setNfts(items.reverse())
        }

    }

    useEffect(() => {
        getMyNfts()
    }, [data.account])


    return (
        <div style={{ color: "white", backgroundColor: "#24252d" }}>
            <div className="bids-container">
                <div className="bids-container-text">
                    <h1>Your Minted NFTs ({nfts.length})</h1>
                </div>
                <div className="bids-container-card">
                    {nfts.map((nft, i) => {
                        return (
                            <div className="card-column" key={i}>
                                <div className="bids-card">
                                    <div className="bids-card-top">
                                        <img src={nft.image} alt="" />
                                        <Link to={`/nft-items/${nft.id}`}>
                                            <p className="bids-title">
                                                {nft.name}
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

        </div>
    );
};

export default Dashboard;