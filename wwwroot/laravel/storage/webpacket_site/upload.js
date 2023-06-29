const fs = require("fs");
const { Dropbox } = require("dropbox");
/**
 * 封装的方法：将文件上传到Dropbox
 * @param {string} accessToken Dropbox访问令牌
 * @param {string} localFilePath 本地文件路径
 * @param {string} remoteFilePath 远程文件路径
 * @returns {Promise} 返回一个Promise，可用于处理上传结果
 */
function uploadFileToDropbox(accessToken, localFilePath, remoteFilePath) {
    return new Promise((resolve, reject) => {
        // 实例化Dropbox客户端
        const dbx = new Dropbox({ accessToken });

        // 读取本地文件内容
        fs.readFile(localFilePath, (err, contents) => {
            if (err) {
                reject(err);
                return;
            }

            // 上传文件到Dropbox
            dbx.filesUpload({
                path: remoteFilePath,
                contents,
                mode: { ".tag": "overwrite" },
            })
                .then((response) => {
                    const fileMetadata = response.result;
                    const fileId = fileMetadata.id;
                    console.log(fileId);
                    // 创建共享链接
                    dbx.sharingCreateSharedLink({
                        path: fileId,
                    })
                        .then((linkResponse) => {
                            const downloadLink = linkResponse.result.url;
                            resolve({ fileMetadata, downloadLink });
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
}

const NEXT_PUBLIC_OWNER = "0x9A2fe7021FC94a1B995A9241343A2D9c3F06af3d";
const accessToken =
    "sl.BhPtVks6sPIBFTnxePAlP1wlCsnC9t3ejma8m-Ra7ZD3XAaPWr1zZ086WJLGuSLuW7JCBO-gcmbRajAfufcYnpPudCTVigQ4ACXdpQ4qREteabhus8bobLxtN1_wFn79mXCnLWVX5TvK";
const localFilePath = "./zipfile/" + NEXT_PUBLIC_OWNER + ".zip";
const remoteFilePath = "/" + NEXT_PUBLIC_OWNER + ".zip";

uploadFileToDropbox(accessToken, localFilePath, remoteFilePath)
    .then((result) => {
        const { fileMetadata, downloadLink } = result;
        //console.log("File uploaded:", fileMetadata);
        console.log("Download link:", downloadLink);
    })
    .catch((error) => {
        console.error("Error uploading file:", error);
    });
