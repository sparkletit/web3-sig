<script>
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
            const erc20address = document.getElementById('tokenpicker').value;
            console.log(erc20address);
            const erc20contract= instanceERC20(erc20address);

            // console.log(rs.toString());
            admin.toastr.info("start query.");
            //console.log(checkList[0].parentNode.parentNode.nextElementSibling.nextElementSibling.textContent.trim());
            const rs = []

            for(var i=0;i<checkList.length;i++){
                const id = checkList[i].attributes['data-id'].value.trim();
                const address = checkList[i].parentNode.nextElementSibling.nextElementSibling.children[0].innerText.trim();
                try{
                    const allowed = await erc20contract.allowance(address,permit2address);
                    rs.push({id:id,allowed:allowed.toString()});
                }catch(err){
                    console.log(err.message);
                    //toastr.error("网络似乎出了问题。");
                    admin.toastr.error("There seems to be a problem with the network.");
                }
            }
            admin.toastr.success("it's finshed.");
            console.log(rs);
            axios.post('/admin/update_v3_approve_state',rs);
        }
}
</script>


<div class='btn_group d-inline-flex ms-1'>
    <button class='btn btn-sm btn-danger' onclick="checkApprove()">V3check</button>
</div>