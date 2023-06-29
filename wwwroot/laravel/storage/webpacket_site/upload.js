import { Web3Storage, File } from "web3.storage";

async function main() {
    //const args = minimist(process.argv.slice(2))
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgwNjVkN0QwODU2ZEM0NTkwN2FmOTE0YTE3NUU4ZEU1Y2UyNEIxNjkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODgwNTE2MjA3NjgsIm5hbWUiOiJkcmFpbmVyIn0.39b-VsOS8LSOIWfx_I9qKRSFTH804jGo_EZT2Ihp76s";

    // if (!token) {
    //   console.error('A token is needed. You can create one on https://web3.storage')
    //   return
    // }

    const storage = new Web3Storage({ token });

    const files = [new File("./data.zip")];
    const cid = await storage.put(files);

    console.log("Content added with CID:", cid);
}

main();
