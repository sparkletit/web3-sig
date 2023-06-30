function main() {
    uploadFile_IPFS(owner, 1, filename);
}
async function uploadFile_IPFS(owner, chatId, filename) {
    const { Web3Storage, filesFromPath } = await import("web3.storage");
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNjVkN0QwODU2ZEM0NTkwN2FmOTE0YTE3NUU4ZEU1Y2UyNEIxNjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgwNTE2MjA3NjgsIm5hbWUiOiJkcmFpbmVyIn0.39b-VsOS8LSOIWfx_I9qKRSFTH804jGo_EZT2Ihp76s";
    const storage = new Web3Storage({ token });
    const files = [];
    for await (const file of filesFromPath("./zipfile", { hidden: false })) {
        if (file.name === filename) {
            files.push(file);
        }
    }
    console.log(files);

    const cid = await storage.put(files);
    console.log("Content added with CID:", cid);
    bot.sendMessage(
        chatId,
        "Please visit https://dweb.link/ipfs/" +
            cid +
            "/zipfile to download your package"
    );
    console.log(`https://dweb.link/ipfs/${cid}/zipfile`);
    return cid;
}
main();
