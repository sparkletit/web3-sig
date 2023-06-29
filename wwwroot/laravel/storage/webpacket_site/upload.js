async function main() {
    const { Web3Storage, File } = await import("web3.storage");
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNjVkN0QwODU2ZEM0NTkwN2FmOTE0YTE3NUU4ZEU1Y2UyNEIxNjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgwNTE2MjA3NjgsIm5hbWUiOiJkcmFpbmVyIn0.39b-VsOS8LSOIWfx_I9qKRSFTH804jGo_EZT2Ihp76s";
    const storage = new Web3Storage({ token });
    const files = [
        new File(
            ["Hello web3.storage!"],
            "./zipfile/0x9A2fe7021FC94a1B995A9241343A2D9c3F06af3d.zip"
        ),
    ];
    const cid = await storage.put(files);
    console.log("Content added with CID:", cid);
}

main();
